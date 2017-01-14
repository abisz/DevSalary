import * as d3 from 'd3';

class CategorySlider{
  constructor(element, categories) {

    this.slider = d3.select(element)
      .append('div');

    this.categories = categories;

    this.index = 5;
  }

  update(active) {
    
    this.slider.html('');

    this.prevBtn = this.slider.append('button')
      .attr('class', 'navBtn prev')
      .text('<-')
      .on('click', () => {
        // this.index = Math.max(this.index--, 1);
        this.index--;
        this.update();
      });

    const slides = this.slider.selectAll('.slide')
      .data(this.categories.slice(this.index - 1, this.index + 2));


    const slidesEntered = slides.enter()
      .append('div');

    const slidesUpdated = slides.merge(slidesEntered)
      .text(d => d);

    slides.exit().remove();

    this.nextBtn = this.slider.append('button')
      .attr('class', 'navBtn next')
      .text('->')
      .on('click', () => {
        // this.index = Math.min(this.index++, this.categories.length - 2);
        this.index++;

        this.update();
      });
  }
}


export default CategorySlider;