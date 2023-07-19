module.exports = class {
  onMount() {
    const { id, src } = this.input;
    if (!id) {
      throw new Error("Missing ID for SVG Loader");
    }
    const data = require(`../../assets/svg/${src}`);
    const img = document.getElementById(id);
    img.src = data;
  }
};
