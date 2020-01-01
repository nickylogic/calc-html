let depends = {};

class CalcX extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const element = this;
        getargs(this).forEach((a)=>{
            depends[a] = (depends[a] || []).concat(element);
        }); // Store id-to-element dependencies //TODO parse from expression
        this.span = document.createElement('span');
        this.attachShadow({mode: 'open'}).appendChild(this.span);
        update(this);
    }
    /**
     * @param {string} text
     */
    set innerText(text) {
        super.innerText = text;
        this.span.innerText = text;
    }
}

window.customElements.define('calc-x', CalcX);   

class CalcIn extends HTMLInputElement {
    constructor() {
        super();
        this.addEventListener("change", (evt) => propagate(evt.target)); 
    }
}

window.customElements.define('calc-in', CalcIn, { extends: "input" });  

function update(element) {
    const script = 
        '(() => {\n' +
        getargs(element).
            map((a)=>`const ${a} = document.getElementById('${a}').value;`).
            join('\n') +
        `\nreturn \`${element.dataset.out}\`;\n` +
        '})();'; //TODO should be type sensitive -- look into JS language parsing
    element.innerText = eval(script);

    propagate(element);
}

function propagate(element) {
    const uses = depends[element.id] || [];
    uses.forEach(update);
}

function getargs(element) {
    return (element.dataset.in || '').split(',').filter((a)=>(a!=''));
}

export default { propagate }