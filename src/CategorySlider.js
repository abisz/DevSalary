import * as d3 from 'd3';
import data_config from "../data/data_config.json"
//TODO check import ../ vs ./

class CategorySlider{
  constructor(element, categories, clickEvent) {

    this.slider = d3.select(element)
      .append('div');

    this.categories = categories;

    this.index = 1;

    this.clickEvent = clickEvent;
  }

  update(active) {
    
    this.slider.html('');

    this.prevBtn = this.slider.append('div')
      .attr('class', 'slider-button')
      .append('button')
      .attr('class', 'navBtn fa fa-arrow-left')
      .on('click', () => {
        this.index = Math.max(this.index - 1, 1);
        this.update(active);
      });

    const slides = this.slider.selectAll('.slide')
      .data(this.categories
          .filter(c => data_config.hasOwnProperty(c))
          .slice(this.index - 1, this.index + 2));


    const slidesEntered = slides.enter()
      .append('div');

    const slidesUpdated = slides.merge(slidesEntered)
      .text(d => data_config[d])
      .attr('class', d => 'category ' + (d === active ? 'active' : ''))
      .on('click', this.clickEvent);

    slides.exit().remove();

    this.nextBtn = this.slider.append('div')
      .attr('class', 'slider-button')
      .append('button')
      .attr('class', 'navBtn fa fa-arrow-right')
      .on('click', () => {
        this.index = Math.min(this.index + 1, this.categories.length - 2);
        this.update(active);
      });
  }
}


export default CategorySlider;