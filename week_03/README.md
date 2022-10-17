# CAPP 30239 Autumn 2022 Week 3 Repo

# Description

This repository contains the files used during the course of the third week of the Autumn 2022 CAPP Data Visualization course.

## Directories

- in_class: Contains the data and files used as part of class work during third week
- bar_chart_hw: Contains my third week homework submission
- street_address_data and census_data: Contains the data for my final project. The They are described further below.

# Final Project Data Description

## Street Address Data

This data consists of over 56,000 points, spread over a more than 90 year period, stretching from the 1890s to the 1980s. Each one corresponds to a street address that appears in a University of Chicago campus publication, the majority from the Maroon, the University's student paper. Most of these addresses appear as part of advertisements, usually for apartments or businesses, looking for customers among the students and faculty. As a consequence, they serve as a running record of the geographic extent of the university community, which can be compared to other variables, like race or University policies.

There are ten csvs in the street_address_data folder. Each represents a seperate scraping. I will create a combined csv for the visualization, but I wanted to present the data as collected first.

## Source

This data is self generated, and directly derived from primary sources. I created it as part of my undergraduate BA thesis in Geography. The data was mined from digitized historic documents contained in [Campus Publications](https://campub.lib.uchicago.edu/), the University of Chicago's online archive of its community oriented publications.

The documents contained in Campus Publications were originally printed. However, now that they have been digitized, they are key-word searchable. I decided to take advantage of this functionality, by writing a script that would loop through every street address on a "South" or "East" labeled street (ie 1005 E 60th Street, or 5900 South Ellis Ave) and keyword search them in Campus Publications. These addresses were themselves taken from the Chicago Open Data Portal, which maintains a [document](https://data.cityofchicago.org/Transportation/Chicago-Street-Names/i6bp-fvbx/data) with the name of every street in Chicago and their address number ranges. In all, given the multiple permutations of each address (1005 E 60th, 1005 East 60th Street, etc.) my script made over 5 million keyword searches. The effort was such that I was allowed to run the script on the Midway2 federated supercomputer.

## Interest

I created this data as part of a thesis that explored the history of the University's campaign of urban renewal in Hyde Park. I wanted to formally quantify claims about the distribution of the University Community that were widely repeated in archival sources, but never fully verified.

## Use

The data I created as part of my thesis was enlightening. It quantified something that was previously attested to only qualitatively in source material. However, my visualizations were not as effective as they could have been. In my ideal world, this project will allow me to create an interactive, publically accessible version of the data, allowing readers to explore patterns in the data that became evident to me only after careful study. 

## Concerns

The data I created was not perfect. The mechanism I used to create it was highly computationally intensive, compared to more sophisticated methods like natural langauge processing. Furthermore, it relied on a modern list of street names. MLK Drive, for example, went by "Grand Boulevard" for much of the period covered by the data. Because Grand Boulevard is not a modern street, addresses that appeared on it are totally missing from the data.

## Supplemental Data

I intend to supplement my street address data with historic census data (most of all on race) taken from [IPUMS NHGIS](https://www.nhgis.org/). This data will provide a point of comparison for the distribution of University street addresses. The University of Chicago's campaign of urban renewal was motivated by the flight of students and faculty from Hyde Park in response to spatial expansion of the South Side Black community in the years after the Second World War. Therefore race provides a particularly valuable comparison.

Currently, the census_data directory contains a single sub-directory: 1920_race_csv. This contains the proportion of White and Black residents in every Chicago Census tract in 1920. IPUMS NHGIS houses spatial data for every decennial Census, not just 1920. However, the data is stored as seperate csvs and shapefiles. Converting this data into geojsons more suitable for JS web visualizations is providing a time consuming process. However, it will be complete by the end of the week.

## Additional Data Wrangling

In addition to the convertion of the Census shapefiles to geojsons, there is one more (secondary) bit of data gathering that I have planned. I would love it if viewers were able to click on a street-address point and be given access to the article it was taken from. However when I created the script, I neglected to have it save URLs. Thankfully, I had the foresight to save all the HTML files with valid addresses. This means that scraping together the URLs will not require repeating the entire data gathering process, just the final stage, with some minor code modifications.
