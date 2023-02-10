import { adoptStyles } from '@lit/reactive-element/css-tag.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import type { PolymerElement } from '@polymer/polymer';
import { StampedTemplate } from '@polymer/polymer/interfaces';

// Proposed interface changes
declare global {
  interface ShadowRootInit {
    customElements?: CustomElementRegistry;
  }
  interface ShadowRoot {
    importNode(node: Node, deep?: boolean): Node;
  }
}

// @ts-ignore
const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PolymerElementConstructor = new (...args: any[]) => PolymerElement;

function conditionallyRegister(registry: CustomElementRegistry, tagName: string, klass: CustomElementConstructor) {
  const registeredClass = registry.get(tagName);
  if (registeredClass && registeredClass !== klass) {
    // eslint-disable-next-line no-console
    console.error(
      [
        `You are trying to re-register the "${tagName}" custom element with a different class via ScopedElementsMixin.`,
        'This is only possible with a CustomElementRegistry.',
        'Your browser does not support this feature so you will need to load a polyfill for it.',
        'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
        'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
        'For more details you can visit https://open-wc.org/docs/development/scoped-elements/'
      ].join('\n')
    );
  }
  if (!registeredClass) {
    return registry.define(tagName, klass);
  }
  return registry.get(tagName);
}

export type ElementDefinitionsMap = {
  [key: string]: typeof HTMLElement;
};

type TemplateInfo = any; //Polymer

function ScopedRegistryHost<SuperClass extends PolymerElementConstructor>(superClass: SuperClass) {
  class ScopedRegistryMixin extends superClass {
    static scopedElements?: ElementDefinitionsMap;
    static shadowRootOptions?: ShadowRootInit;
    static registry?: CustomElementRegistry;

    renderRoot?: HTMLElement | ShadowRoot;

    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * This is borrowed from Lit.  Polymer's native life-cycle method for
     * this, `_attachDom` is too late and presents some problems.  When
     * using this mixin, the element's renderRoot will be created prior
     * to `_attachDom`. This newly introduced method still occurs as
     * part of the `ready` lifecycle.. it just happens a bit earlier now
     * since it is needed for template stamping
     *
     * @return Returns a node into which to render.
     */
    _createRenderRoot(): HTMLElement | ShadowRoot {
      if (this.renderRoot) {
        return this.renderRoot;
      }

      const constructor = this.constructor as typeof ScopedRegistryMixin & typeof PolymerElement;

      const { registry, scopedElements, shadowRootOptions } = constructor;

      if (scopedElements && !registry) {
        constructor.registry = supportsScopedRegistry ? new CustomElementRegistry() : customElements;
        for (const [tagName, klass] of Object.entries(scopedElements)) {
          conditionallyRegister(constructor.registry, tagName, klass);
        }
      }

      const options: ShadowRootInit = {
        mode: 'open',
        // shadyUpgradeFragment: dom, // broke this because lifecycle has changed (see _attachDom)
        ...shadowRootOptions,
        customElements: constructor.registry
      };
      const renderRoot = this.attachShadow(options);

      // @ts-ignore
      if (this.constructor._styleSheet) {
        // @ts-ignore
        adoptStyles(renderRoot, this.constructor._styleSheet);
      }

      this.renderRoot = renderRoot;
      return renderRoot;
    }

    /**
     * The polymer "ready" life-cycle calls this function
     *
     * Polymer mixins define this function in multiple superclasses.
     *
     * `libs/mixins/property-effects`
     * `libs/mixins/template-stamp`
     *
     * Ultimately there is a problem in template-stamp.js because it uses
     * document.importNode
     *
     * @param template
     * @param templateInfo
     * @returns
     */
    override _stampTemplate(template: HTMLTemplateElement, templateInfo: TemplateInfo) {
      this._createRenderRoot();

      if (!this.shadowRoot) {
        return super._stampTemplate(template, templateInfo);
      }

      const nativeImportNode = document.importNode;
      // @ts-ignore
      document.importNode = (node: Node, deep?: boolean) => {
        return this.shadowRoot?.importNode(node, deep);
      };
      try {
        // don't circumvents the local shadowRoot's registry
        return super._stampTemplate(template);
      } catch (e) {
        document.importNode = nativeImportNode;
        throw e;
      }
    }

    /**
     * Override from polymer core element-mixin
     *
     * Attaches an element's stamped dom to itself. By default,
     * this method creates a `shadowRoot` and adds the dom to it.
     * However, this method may be overridden to allow an element
     * to put its dom in another location.
     *
     * @override
     * @throws {Error}
     * @suppress {missingReturn}
     * @param {StampedTemplate} dom to attach to the element.
     * @return {ShadowRoot} node to which the dom has been attached.
     */
    _attachDom(dom: StampedTemplate | null): ShadowRoot | null {
      if (!dom) {
        return null;
      }
      this.renderRoot?.appendChild(dom);
      return this.renderRoot as ShadowRoot;
    }
  }

  return ScopedRegistryMixin;
}

export const ScopedRegistryMixin = dedupeMixin(ScopedRegistryHost);
