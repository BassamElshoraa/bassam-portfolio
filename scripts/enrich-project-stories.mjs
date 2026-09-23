import { readFile, writeFile } from "node:fs/promises";

const path = new URL("../public/data/portfolioProjects.json", import.meta.url);
const projects = JSON.parse(await readFile(path, "utf8"));
const stories = {
  27: ["Lending activity, borrower profiles, and financial performance were difficult to assess in one view.", "Organized lending measures and DAX calculations into an interactive Power BI report with borrower and performance views.", "The report gives analysts a clearer way to compare loan patterns and investigate portfolio performance."],
  26: ["Compare sales performance across three countries over the 2014–2017 period.", "Built an interactive Power BI dashboard with country and time-based sales views.", "Makes geographic and year-over-year sales patterns easier to examine."],
  25: ["Understand how Mohamed Salah's match contributions vary across Premier League seasons.", "Analyzed match-level goals, assists, appearances, and other performance measures in Python.", "Presents seasonal comparisons and evidence-led views of his on-field contribution."],
  24: ["Explore how diamond characteristics relate to price and estimate prices from those attributes.", "Used Python to examine carat, cut, color, and clarity before building a predictive model.", "Provides an exploratory view of price drivers alongside a model-based estimate."],
  23: ["Forecast future website visits from a year of historical traffic observations.", "Prepared the June 2021–June 2022 visitor series and applied time-series analysis with Python and Statsmodels.", "Shows historical traffic patterns and a reproducible forecasting workflow."],
  22: ["Make a large used-vehicle listings dataset easier to compare by price and specification.", "Explored prices, condition, fuel type, transmission, year, and location using Python visualizations.", "Surfaces listing distributions and market patterns for further investigation."],
  21: ["Identify which recorded attributes are associated with differences in health-insurance charges.", "Cleaned and explored the insurance dataset, then compared costs across its demographic and behavioral variables.", "Provides a clearer descriptive view of cost variation; it does not make clinical or pricing decisions."],
  18: ["Describe how discussion sentiment varied across Reddit conversations about the conflict.", "Processed comment text, timestamps, subreddit labels, and sentiment fields in Python.", "Summarizes discussion timing, activity, and sentiment in the sampled online comments—not public opinion as a whole."],
  19: ["Investigate how car specifications relate to fuel consumption in the Auto MPG dataset.", "Used Python to compare vehicle attributes with miles-per-gallon values through exploratory charts and statistics.", "Makes the dataset's consumption patterns and candidate explanatory variables easier to inspect."],
  8: ["Explore a relational dataset describing water access and service conditions in Maji Ndogo.", "Inspected schemas and wrote SQL queries across the project's staged water-service analysis.", "Documents the questions and query results used to investigate access and service problems."],
  9: ["Answer analytical questions from a movie database with related titles, people, genres, and dates.", "Used SQL to query and connect movie records across the database structure.", "Provides a reusable set of movie-database queries and analytical examples."],
  6: ["Compare children's survey answers with their interactions in the Calidon game.", "Linked survey and game results in Excel and Power BI, then organized views around eight measured skills.", "Creates a joined view of survey responses and gameplay indicators for educational review."],
  1: ["Make US bike-share trip data explorable through a simple terminal interface.", "Wrote a Python program that filters trip records and calculates descriptive statistics from user selections.", "Lets users request and review bike-share statistics interactively."],
  0: ["Explore how movie ratings and revenue vary across a 10,000-title TMDb dataset.", "Used a Jupyter Notebook and Python to clean, compare, and visualize the chosen movie fields.", "Presents descriptive patterns and questions for further investigation without asserting causation."],
  12: ["Examine whether diagnostic measurements can distinguish diabetes status in the source dataset.", "Prepared predictor variables and developed a classification-oriented modeling workflow in Python.", "Demonstrates an analytical model on historical data; it is not a medical diagnostic tool."],
  11: ["Make workforce demographics and commute-related indicators easier to understand.", "Built report views for age, gender, distance from home, and marital-status breakdowns.", "Gives HR viewers a structured descriptive overview of employee segments."],
  10: ["Bring sales volume, revenue, margin, products, locations, and time trends into one report.", "Cleaned data in Power Query and designed Power BI views with DAX measures and interactive filters.", "Makes sales performance and product-level comparisons available in one dashboard."],
  17: ["Investigate product sales, pricing, and customer preferences in an Alibaba-style retail dataset.", "Wrote SQL queries across product, quantity, payment, and shipping-city fields.", "Produces query-based views of transaction and pricing patterns."],
  15: ["Organize menu and order records so restaurant activity can be queried consistently.", "Created and populated relational tables, then used SQL operations to retrieve and analyze orders.", "Provides a queryable foundation for menu and order analysis."],
  14: ["Find patterns in employee satisfaction across departments and survey statements.", "Imported and cleaned Excel survey responses, then summarized agreement levels and visualized comparisons.", "Highlights areas that warrant closer discussion with employees."],
  13: ["Understand customer behavior and flight activity alongside loyalty-program history.", "Combined relevant airline and loyalty records in Excel and Power BI for interactive analysis.", "Provides a consolidated view of loyalty and engagement patterns."],
  16: ["Explore which booking characteristics and guest preferences appear in hotel reservations.", "Wrote SQL queries over room, meal-plan, lead-time, arrival, price, and booking-status fields.", "Makes reservation mix and booking trends easier to review."],
  3: ["Compare employee salaries, performance ratings, and gender distribution in one report.", "Prepared Excel employee data in Power Query and built Power BI views for the main workforce measures.", "Offers a compact descriptive dashboard for employee-related metrics."],
  4: ["Track sales and profit at monthly and daily levels from Excel report data.", "Transformed the source in Power Query and designed a Power BI dashboard for time-based performance views.", "Allows users to inspect sales and profit trends interactively."],
  2: ["Bring export destinations and receivables into a single view for 2016–2018.", "Used company worksheet data, Power Query, and Power BI to display country counts, paid and remaining amounts, and destination breakdowns.", "Makes export activity and payment status easier to review by country."],
};

for (const project of projects) {
  const story = stories[project.id];
  if (!story) continue;
  project.challenge ||= story[0];
  project.approach ||= story[1];
  project.impact ||= story[2];
  if (project.id === 26) project.title = "Power BI Sales Report";
  if (project.id === 21) project.description = "An exploratory analysis of a US health-insurance dataset, comparing charges across recorded demographic and behavioral factors to understand patterns in cost variation.";
  if (project.id === 12) project.title = "Diabetes Status Prediction Model - MeriSKILL Internship";
}

await writeFile(path, `${JSON.stringify(projects, null, 2)}\n`);
console.log(`Updated ${Object.keys(stories).length} project stories.`);
