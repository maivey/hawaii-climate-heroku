# Hawaii Climate App
You've decided to treat yourself to a long holiday vacation in Honolulu, Hawaii! To help with your trip planning, this app provides climate analysis on the area.

- - -
## Prerequisites
This script requires imports of the following:

Import numpy and pandas:
```python
import numpy as np
import pandas as pd
```
Import libraries to handle dates and statistics:
```python
from datetime import datetime
import datetime as dt
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from scipy import stats
```
Import sqlalchemy dependencies:
```python
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import inspect
```

Import Flask dependencies:

```python
import flask
from flask import Flask, jsonify
from flask import render_template, url_for
from flask import request

from flask_sqlalchemy import SQLAlchemy
```



## Step 1 - Climate Analysis and Exploration

This script uses Python, SQLAlchemy, Javascript, Plotly.js, D3.js, and Flask to do basic climate analysis and data exploration of the provided climate database. All of the following analysis are completed using SQLAlchemy ORM queries and Pandas

* Choose a start date and end date for your trip. Made sure that your vacation range is approximately 3-15 days total.


### Precipitation Analysis

* Designs a query to retrieve the last 12 months of precipitation data.
* Selects only the `date` and `prcp` values.
* Loads the query results into a Pandas DataFrame and sets the index to the date column.
* Sorts the DataFrame values by `date`.
* Plots the results using plotly.js.
* Uses D3.js to print the summary statistics for the precipitation data.
* Uses D3.js to display a table of the precipitation data.

### Station Analysis

* Designs a query to calculate the total number of stations.

* Designs a query to find the most active stations.

  * Lists the stations and observation counts in descending order.

  * Determines which station has the highest number of observations


* Designs a query to retrieve the last 12 months of temperature observation data (tobs).

  * Filters by the station with the highest number of observations.

  * Plots the results as a histogram with `bins=12`.

- - -

## Step 2 - Climate App

After completing the initial analysis, a Flask API is designed based on the queries that have just been developed.

* Use FLASK to create the routes.

### Routes

* `/`

  * Home page.
* Depending on user selection, displays graphs, statistics, and data for the JSON representation returned by one of the routes below
  * Ensures valid user input
* `/graphs`
  * Trip page
  * Depending on user input for start and end, displays graphs, statistics, and data for the JSON representation returned by one of the routes below
  * Ensures valid user input
* `/api/v1.0/precipitation`

  * Converts the query results to a Dictionary using `date` as the key and `prcp` as the value.

  * Returns the JSON representation of the dictionary.
* `/api/v1.0/stations`

  * Returns a JSON list of stations from the dataset.
* `/api/v1.0/station_counts`
  * Returns the JSON list of stations and station counts from the dataset
* `/api/v1.0/top_station`
  * Returns the JSON list of the minimum temperature, the average temperature, and the max temperature for the most active station
* `/api/v1.0/top_station_tobs`
  * Returns a JSON list of the last 12 months of temperature observation data for the station with the highest number of temprature observations

* `/api/v1.0/tobs`
  * queries for the dates and temperature observations from a year from the last data point.
  * Returns a JSON list of Temperature Observations (tobs) for the previous year.
* `/api/v1.0/<start>` and `/api/v1.0/<start>/<end>`

  * Returns a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
* When given the start only, calculates `TMIN`, `TAVG`, and `TMAX` for all dates greater than and equal to the start date.
  * When given the start and the end date, calculates the `TMIN`, `TAVG`, and `TMAX` for dates between the start and end date inclusive.
* `/trip_norm_prev_year/<start>/<end>`
  * Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end dates for the *previous* year.
* `/trip_norm_each_year/<start>/<end>`
  * Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end date for *each year* in the dataset prior to the given year.
* `/rainfall_last_year/<start>/<end>`
  * Returns a JSON representation of the station, station name, lat, lon, elevation, and total amount of rainfall for a given start or start-end date for the *previous* year.
* `/rainfall/<start>/<end>`
  * Returns a JSON representation of the station, station name, lat, lon, elevation, and total amount of rainfall for a given start or start-end date for *each year* in the dataset prior to the given year.

- - -

## Other Analyses


### Temperature Analysis I

* Hawaii is reputed to enjoy mild weather all year. Included in the script, determines if there a meaningful difference between the temperature in, for example, June and December?


* Identify the average temperature in June at all stations across all available years in the dataset. Do the same for December temperature.

* Paired t-test:

Hypothesis Test:
```text
H0 : uj = ud (The means are the same)
Ha : uj != ud (The means are different)
```
Testing at ```alpha = 0.05```

I used paired t-test since the two variables, average tobs in June and average tobs in December, are taken from the same stations, but at different times. Since the average tobs in June can be paired with the average tobs in December, we use a paired t-test. Additionally, there are no obvious outliers in each sample, as shown in the Box Plot below.

Results:

The p-value is ```0.0032683642779833687```

Testing at alpha=0.05, since p=0.0032683642779833687 < alpha=0.05, the findings are statistically significant. We can reject the null hypothesis in support of the alterative with 95% confidence.

### Temperature Analysis II

* Uses the `calc_temps` function to calculate the min, avg, and max temperatures for your trip using the matching dates from the previous year (i.e., use "2017-01-01" if my trip start date was "2018-01-01").

* Plots the min, avg, and max temperature from my previous query as a bar chart.

  * Uses the average temperature as the bar height.

  * Uses the peak-to-peak (tmax-tmin) value as the y error bar (yerr).


### Daily Rainfall Average

* Calculates the rainfall per weather station using the previous year's matching dates.

* Calculates the daily normals. Normals are the averages for the min, avg, and max temperatures.

* A function called `daily_normals` calculates the daily normals for a specific date. This date string will be in the format `%m-%d`.

* Creates a list of dates for my trip in the format `%m-%d`. Uses the `daily_normals` function to calculate the normals for each date string and append the results to a list.

* Loads the list of daily normals into a Pandas DataFrame and set the index equal to the date.

* Uses Pandas to plot an area plot (`stacked=False`) for the daily normals.
