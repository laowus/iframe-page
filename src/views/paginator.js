const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const makeMarginals = (length, part) => Array.from({ length }, () => {
    const div = document.createElement('div')
    const child = document.createElement('div')
    div.append(child)
    child.setAttribute('part', part)
    return div
})
const setStylesImportant = (el, styles) => {
    const { style } = el
    for (const [k, v] of Object.entries(styles)) style.setProperty(k, v, 'important')
}

class View {
    #observer = new ResizeObserver(() => this.expand())
    #element = document.createElement('div')
    iframe = document.createElement('iframe')
    #contentRange = document.createRange()
    #size
    #layout
    constructor({ container }) {
        this.container = container
        this.#element.append(this.iframe)
        Object.assign(this.#element.style, {
            boxSizing: 'content-box',
            position: 'relative',
            overflow: 'hidden',
            flex: '0 0 auto',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        })
        Object.assign(this.iframe.style, {
            overflow: 'hidden',
            border: '0',
            display: 'none',
            width: '100%', height: '100%',
        })
        this.iframe.setAttribute('scrolling', 'no')
    }
    get element() {
        return this.#element
    }
    get document() {
        return this.iframe.contentDocument
    }

    async load(src, beforeRender) {
        console.log(src)
        if (typeof src !== 'string') throw new Error(`${src} is not string`)
        return new Promise(resolve => {
            this.iframe.addEventListener('load', () => {
                const doc = this.document
                this.#contentRange.selectNodeContents(doc.body)
                const layout = beforeRender()
                this.render(layout)
            })
        }, { once: true })
        this.iframe.src = src
    }
    expand() {
        console.log('expand')
    }
    render(layout) {
        console.log(layout)
        if (!layout) return
        this.#layout = layout
        this.columnize(layout)
    }

    //设置html文件的html body
    columnize({ width, height, gap, columnWidth }) {
        console.log("columnize({ width, height, gap, columnWidth })", width, height, gap, columnWidth)
        this.#size = width
        const doc = this.document//iframe
        setStylesImportant(doc.documentElement, {
            'box-sizing': 'border-box',
            'column-width': `${Math.trunc(columnWidth)}px`,
            'column-gap': `${gap}px`,
            'column-fill': 'auto',
            'height': `${height}px`,
            'padding': `0 ${gap / 2}px`,
            'overflow': 'hidden',
            // force wrap long words
            'overflow-wrap': 'break-word',
            // reset some potentially problematic props
            'position': 'static', 'border': '0', 'margin': '0',
            'max-height': 'none', 'max-width': 'none',
            'min-height': 'none', 'min-width': 'none',
            // fix glyph clipping in WebKit
            '-webkit-line-box-contain': 'block glyphs replaced',
        })
        setStylesImportant(doc.body, {
            'max-height': 'none',
            'max-width': 'none',
            'margin': '0',
        })
        // this.setImageSize()
        // this.expand()
    }

    destroy() {
        if (this.document) this.#observer.unobserve(this.document.body)
    }
}

export class Paginator extends HTMLElement {
    #root = this.attachShadow({ mode: 'closed' })
    #observer = new ResizeObserver(() => this.render())
    #top
    #container
    #header
    #footer
    #margin = 0
    constructor(src) {
        super()
        this.#root.innerHTML = `<style>
            :host {
                container-type: size;
            }
            :host, #top {
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 100%;
            }
            #top {
                --_gap: 7%;/* 列间隔 */
                --_margin: 48px;
                --_max-inline-size: 600px;/* 设置*/
                --_max-block-size: 1200px;/* 最大宽度 */
                --_max-column-count: 2; /* 列数 两列 */
                --_max-column-count-portrait: 1;
                --_max-column-count-spread: var(--_max-column-count);
                --_half-gap: calc(var(--_gap) / 2);
                --_max-width: calc(var(--_max-inline-size) * var(--_max-column-count-spread));
                --_max-height: var(--_max-block-size);
                display: grid;
                grid-template-columns:
                    minmax(var(--_half-gap), 1fr) /* 宽度 > 3.5%*/
                    var(--_half-gap) /* 宽度 = 3.5%*/
                    minmax(0, calc(var(--_max-width) - var(--_gap))) /* 宽度< 86%*/
                    var(--_half-gap)/* 宽度 = 3.5%*/ 
                    minmax(var(--_half-gap), 1fr); /* 宽度 > 3.5%*/
                grid-template-rows:
                    minmax(var(--_margin), 1fr)
                    minmax(0, var(--_max-height))
                    minmax(var(--_margin), 1fr);
            }
            
            /* 宽度 < 96.5%  高度 < h-48px ||  _max-block-size 1200 */
            #container {
                grid-column: 2 / 5;
                grid-row: 2;
                overflow: hidden;
            }
            #header {
                grid-column: 3 / 4;
                grid-row: 1;
            }
            /* 显示页码 和 按钮 */
            #footer {
                grid-column: 3 / 4;
                grid-row: 3;
                align-self: end;
            }
            #header, #footer {
                display: grid;
                height: var(--_margin);
            }
            </style>
            <div id="top">
                <div id="header"></div>
                <div id="container"></div>
                <div id="footer"></div>
            </div>
            `
        this.#top = this.#root.getElementById('top')
        this.#container = this.#root.getElementById('container')
        this.#header = this.#root.getElementById('header')
        this.#footer = this.#root.getElementById('footer')
        this.#observer.observe(this.#container)
        this.#container.addEventListener('scroll', () => this.dispatchEvent(new Event('scroll')))
        this.view = this.createView()
    }
    createView() {
        if (this.view) {
            this.view.destroy()
            this.#container.removeChild(this.view.element)
        }
        this.view = new View({
            container: this
        })
        this.#container.append(this.view.element)
        return this.view
    }

    render() {
        if (!this.view) return
        this.view.render(this.#beforeRender())
    }

    #beforeRender() {
        const { width, height } = this.#container.getBoundingClientRect()
        const size = width
        const style = getComputedStyle(this.#top)
        const maxInlineSize = parseFloat(style.getPropertyValue('--_max-inline-size'))
        const maxColumnCount = parseInt(style.getPropertyValue('--_max-column-count-spread'))
        const margin = parseFloat(style.getPropertyValue('--_margin'))
        this.#margin = margin
        const g = parseFloat(style.getPropertyValue('--_gap')) / 100
        const gap = -g / (g - 1) * size
        const divisor = Math.min(maxColumnCount, Math.ceil(size / maxInlineSize))
        const columnWidth = (size / divisor) - gap
        this.setAttribute('dir', 'ltr')
        const marginalDivisor = divisor
        const marginalStyle = {
            gridTemplateColumns: `repeat(${marginalDivisor}, 1fr)`,
            gap: `${gap}px`,
            direction: this.bookDir === 'rtl' ? 'rtl' : 'ltr',
        }
        Object.assign(this.#header.style, marginalStyle)
        Object.assign(this.#footer.style, marginalStyle)
        const heads = makeMarginals(marginalDivisor, 'head')
        const feet = makeMarginals(marginalDivisor, 'foot')
        this.heads = heads.map(el => el.children[0])
        this.feet = feet.map(el => el.children[0])
        this.#header.replaceChildren(...heads)
        this.#footer.replaceChildren(...feet)
        return { height, width, margin, gap, columnWidth }
    }

}

customElements.define('foliate-paginator', Paginator)