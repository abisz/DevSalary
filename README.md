# DevSalary
### Ivan Popovic and Simon Reinsperger

## Getting started
Install all dependencies:
```
yarn install
```
or
```
npm install
```

Get the development build pipeline and server running:
```
npm start
```
This will start watch tasks that will autorefresh the browser if files are changed.
Restarting the process is only required if new files are added.

A small extraction of the dataset (`data/dataset_small.csv`) is attached in this repo.
Because of its size the full dataset can't get checked in.
You can download the complete dataset from StackOverflow [directely](https://drive.google.com/uc?export=download&id=0B0DL28AqnGsrV0VldnVIT1hyb0E) and add it to the data folder as `dataset_full.csv`.

## Dataset
The dataset used for this visualization is the result of the annual developer survey by StackOverflow for 2016.
It includes the survey answers for a total of 56030 participants.

The survey consists of 65 questions, from which we used 30.
A detailed description of the questions can be found in `data/dataset_explanation.txt`.

## Tasks
The focus of the visualization is the salary of the participants.
It should help answering questions about influences regarding wages and distribution of various demographic and personal features among predefined salary ranges.

An example task could be "How does the gender distribution among young (20-24y) developers change with rising salaries?"

Concrete examples for tasks and what insights can be obtained will be described later in chapter "Insight".

## Design Concept
Our design concept consists of four parts:

### Normalized Stacked Barchart
This is the heart of the visualization.
The bars each represent a salary range and show the normalized distribution of the currently active category (e.g. "gender" or "age range").
The several answering options of a category have a consistent color and are ordered the same way within each bar.
That allows the user to easily recognize trends.

The x axis shows the labels of the salary ranges, while the y axis features ticks in 10% steps.

Additionally a legend is displayed right to the barchart showing all options included in the visualization and their color.

### Bubblechart
Underneath the barchart is a bubblechart representing all options (e.g. "male", "female" or "rather not say") of a category (e.g. "gender").
The size of the bubble indicates the distribution within the whole dataset.

### Overview active filter
Next to the barchart is a list of currently active filters.
Its' purpose is to make the composition of the visualization transparent to the user.

Each item in the list is represented with a small icon, indicating the type of the filter ("only show xy" or "show everything but xy"), the category label for which the filter is created, as well as the value for which it is active.
Next to it there is a button to quickly remove it.

### Category Slider
To change categories, two sliders are implemented - one for the bubblechart and one for the barchart.
They are placed right above their corresponding component.

Each slider has two arrows, which allow scrolling through the list of available categories.
A click on one of them activates it for the component underneath.
The active category is visually marked within the slider.

## Prototype Interaction
### Highlight (Hovereffekt)
The (sub) bars of the barchart have a hovereffect, which will change their color to yellow.

To allow users to focus on a trend of a single option, a hovereffect is implemented to highlight it throughout all salary ranges.
This effect is triggered by hovering over the color rectangle of the corresponding option in the legend.

### Details
Additionally to the hovereffect of the barchart a tooltip was implemented to give a more detailed view (option name and percantage) of the item.

The bubbles also feature a tooltip that shows the absolute number of participants included.

### Filter
There are several interaction possibilities regarding filtering.

#### Creating a filter
This is only possible by clicking on the bubble representing the desired filter value.
It will highlight it to give feedback about the current state of the visualization.

Additionally the newly created filter will also be featured in the filter list.

New filters are always from type "show only xy".

#### Removing a filter
There are two ways to remove an active filter.
One is to click on the same bubble again which will toggle it.

The other one is to click on the previously mentioned remove button in the filter list.

Currently the application only allows one filter per category, which will result in removing a filter if a new one of the same category is selected.

#### Changing filter type
To switch between the two filter types, the user has to click the icon in the filter list.
The icon itself represents the type and clicking it will immediately change it.

### Changing the View
By clicking on a non-active category in the category slider, the view (barchart or bubblechart) will transition into its' new state.

## Insight
The possibilities for data insight of this visualization will be shown with two examples:

*How is the gender distribution among developers depending on their years of experience?*

To answer this question the category of the barchart is set to "Gender", because it's the main aspect we want to investigate.
The category of the bubblechart will be set to "Experience Range", our secondary aspect, which we want to choose from for filtering.

When playing around with the filters it's easy to see some tendencies.
First of all it's obvious that women as a whole are totally underrepresented among developers.
It's interesting to see that the percentage of women in the industry rises when only looking at developers with fewer years of experience (0-5y), while the more experienced developers are highely dominated by men.

This could mean that the gender distribution is trending towards a (little) more balanced community.

It's also worth noting that even so the percentage of women is very low, it gets even lower going up the salary range (from 7% to 2%).

*Is a preference for Star Wars vs. Star Trek having an influence on salary?*
When looking at the "Star Wars vs. Star Trek" chart it's easy to see that there is a certain popularity rise of Star Trek in the higher salary ranges.
To explain this we speculated that this can be described by the age distribution and has nothing to do with Star Trek Fans being more successful in their job.

To validate this theory we chose "Age Range" as the category for the bubblechart and experimented with several filters.
Soon we were able to validate our hypothesis, because we saw that the distribution didn't change with higher income when filtering a certain age range. Therefore the preference of either franchises is correlated to age, which - of course - is correlated to salary.
