export class View extends HTMLElement {
    #root = this.attachShadow({ mode: 'closed' })
    constructor() {
        super()
        this.init()
    }
    async init() {
        await import('./paginator.js')
        //创建分页
        this.renderer = document.createElement('foliate-paginator')
        this.renderer.setAttribute('exportparts', 'head,foot,filter')
        this.#root.append(this.renderer)
    }

}

customElements.define('foliate-view', View)