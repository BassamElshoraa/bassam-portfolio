import {
  FaPython,
  FaProjectDiagram,
  FaChartLine,
  FaBookmark,
  FaPhone,
  FaMailBulk,
} from "react-icons/fa";
import { SiTableau } from "react-icons/si";
import { MdAnalytics, MdBarChart } from "react-icons/md";
import { AiFillSignal, AiOutlineConsoleSql } from "react-icons/ai";
import { RiFileExcel2Fill } from "react-icons/ri";
import { GiBroom } from "react-icons/gi";
import { BsFiletypeSql } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import { FaGithub, FaLinkedin, FaMedium, FaWhatsapp } from "react-icons/fa6";

export class SkillRepository {
  static getSkills() {
    return [
      { skill_name: "Python", icon: <FaPython size={24} /> },
      {
        skill_name: "Power BI & Dax Language",
        icon: <AiFillSignal size={24} />,
      },
      { skill_name: "Tableau", icon: <SiTableau size={24} /> },
      { skill_name: "SQL", icon: <AiOutlineConsoleSql size={24} /> },
      {
        skill_name: "SQL Server (SSIS) (SSAS) (SSRS)",
        icon: <BsFiletypeSql size={24} />,
      },
      { skill_name: "Microsoft Excel", icon: <RiFileExcel2Fill size={24} /> },
      {
        skill_name: "Microsoft Power Query",
        icon: <BiSpreadsheet size={24} />,
      },
      { skill_name: "Data Analytics", icon: <MdAnalytics size={24} /> },
      { skill_name: "Data Cleansing", icon: <GiBroom size={24} /> },
      {
        skill_name: "Data Visualisation",
        icon: <MdBarChart size={24} />,
      },
      {
        skill_name: "Data Modeling",
        icon: <FaProjectDiagram size={24} />,
      },
      {
        skill_name: "Exploratory Data Analysis",
        icon: <FaChartLine size={24} />,
      },
    ];
  }
}

// **************************************************************************************************************

export class IconRepository {
  static getIcons() {
    return [
      {
        id: 1,
        title: "Email",
        content: "Bassam.m.elshoraa@gmail.com",
        link: `mailto:Bassam.m.elshoraa@gmail.com`,
        icon: <FaMailBulk className="w-5 h-5" />,
      },
      {
        id: 2,
        title: "Phone",
        content: "+201004298013",
        link: "tel:+201004298013",
        icon: <FaPhone className="w-5 h-5" />,
      },
    ];
  }
}
// **************************************************************************************************************

export class IconsData {
  getIconsData() {
    return [
      {
        id: 1,
        name: "Linkedin",
        icon: <FaLinkedin />,
        link: "https://www.linkedin.com/in/bassam-elshoraa",
      },
      {
        id: 2,
        name: "Whatsapp",
        icon: <FaWhatsapp />,
        link: "https://wa.me/+201004298013",
      },
      {
        id: 3,
        name: "Github",
        icon: <FaGithub />,
        link: "https://github.com/BassamElshoraa",
      },
      {
        id: 4,
        name: "Medium",
        icon: <FaMedium />,
        link: "https://bassamelshoraa.medium.com/",
      },
    ];
  }
}

// **************************************************************************************************************

export class DataofArray {
  static getData() {
    return [
      {
        id: 1,
        image: "/image/what-doing/avatar-1.png",
        title: "Ali El-Shoraa",
        linkedin: "https://www.linkedin.com/in/ali-el-shoraa",
        content:
          "Working with Bassam was an outstanding experience. He not only met my expectations but exceeded them, delivering exactly what I had envisioned and more. His ability to transform complex data into clear, actionable insights was impressive, and his attention to detail in creating intuitive and visually appealing visualizations made a significant difference. I couldn’t have asked for a better collaborator on this project.",
        skill: "Front End",
      },
      {
        id: 2,
        image: "https://ali-el-shoraa.netlify.app/imgs/ali-eui1.jpg",
        title: "Ali El-Shoraa",
        linkedin: "https://www.linkedin.com/in/ali-el-shoraa",
        content:
          "Bassam is a truly dedicated and skilled data scientist. Having worked with him on several projects, I can say that his commitment and hard work are exceptional. It's always a pleasure collaborating with him, and I’m excited about the projects we'll work on together in the future. He consistently brings valuable insights and a positive attitude to every challenge. Looking forward to what’s ahead!",
        skill: "Front End",
      },
    ];
  }
}

// **************************************************************************************************************

export class DataOfArray {
  static getData() {
    return [
      {
        id: 3,
        icon: "/image/what-doing/data-analysis2.svg",
        title: "Data Analysis",
        content:
          "Performing in-depth data analysis to uncover trends, patterns, and correlations, ensuring high-quality and accurate results.",
      },
      {
        id: 1,
        icon: "/image/what-doing/ML.svg",
        title: "Data Analysis Instructor and Monitor",
        content:
          "Providing comprehensive training programs to empower individuals with essential data analysis skills.",
      },
      {
        id: 2,
        icon: "/image/what-doing/web-spider.svg",
        title: "Web Scraping",
        content:
          "Expertly extracting data from websites to gather valuable information and insights, tailored to meet specific needs.",
      },

      {
        id: 4,
        icon: "/image/what-doing/data-science2.svg",
        title: "Data Science",
        content:
          "Applying advanced techniques to analyze and interpret complex data, providing actionable insights and solutions.",
      },
    ];
  }
}

// **************************************************************************************************************

import {
  BookOpen,
  Briefcase,
  Code,
  Award,
  GraduationCap,
  User,
  // Phone,
  // Mail,
} from "lucide-react";

// أيقونات للأقسام
export const ResumeIcons = {
  summary: <User className="w-6 h-6" />,
  experience: <Briefcase className="w-6 h-6" />,
  skills: <Code className="w-6 h-6" />,
  projects: <BookOpen className="w-6 h-6" />,
  certificates: <Award className="w-6 h-6" />,
  education: <GraduationCap className="w-6 h-6" />,
};

// بيانات السيرة الذاتية
export const ResumeDataProvider = {
  getData: () => [
    // 1. Summary
    {
      title: "Summary",
      icon: ResumeIcons.summary,
      items: [
        {
          position: "Professional Summary",
          company: "",
          date: "",
          description: (
            <p className="text-gray-300 leading-relaxed">
              Detail-oriented Data Analyst with expertise in SQL, Excel, Power
              BI, and Python, dedicated to translating complex datasets into
              clear, impactful insights. Skilled in data visualization,
              simplifying technical findings for diverse audiences, and
              uncovering hidden patterns beyond raw numbers. Adept at
              storytelling with data, crafting compelling narratives that drive
              informed decision-making. Experienced in designing interactive
              dashboards, conducting training sessions, and collaborating across
              teams to enhance data-driven strategies. Passionate about
              delivering actionable insights that bridge the gap between data
              and decision-makers.
            </p>
          ),
        },
      ],
    },

    // 2. Experience
    {
      title: "Experience",
      icon: ResumeIcons.experience,
      items: [
        {
          position: "Data Analyst",
          company: "Shiny White Dental Centers",
          date: "May 2025 – Present | Cairo, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Develop forecasting models using Python (Pandas, Statsmodels) to
                predict, enabling proactive planning and optimized scheduling
              </li>
              <li>
                Collaborate with the finance team to analyze and manage monthly
                budgets and financial statements, ensuring data accuracy and
                supporting cost-reduction initiatives
              </li>
              <li>Design dynamic dashboards in Power BI to track KPIs</li>
              <li>
                Automated financial and operational reporting workflows using
                Power BI and Python
              </li>
              <li>
                Provided data-driven recommendations that improved budget
                allocation and enhanced visibility for senior management
              </li>
            </ul>
          ),
        },
        {
          position: "Data Analysis Instructor",
          company: "IMP - Institute of Management Professionals",
          date: "October 2025 – Present | Cairo, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Delivered advanced Excel training on Power Query, Power Pivot,
                and DAX language for data modeling
              </li>
              <li>
                Conducted Power BI sessions covering DAX time intelligence,
                calculated columns, and performance optimization techniques
              </li>
              <li>
                Mentored students in complex data modeling, relationship
                management, and Microsoft Power BI certification preparation
              </li>
              <li>
                Provided supplementary training on SQL for data analysis, Python
                data manipulation with Pandas, and Power Automate workflow
                automation
              </li>
            </ul>
          ),
        },
        {
          position: "Part-time Data Analysis Instructor",
          company: "NeuroTech",
          date: "December 2024 – October 2025 | Cairo, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Taught key data analysis tools and techniques, including Python,
                statistics, SQL, Power BI, and Excel, to students in the diploma
              </li>
              <li>
                Designed and delivered instructional materials for each module,
                ensuring a deep understanding of both theoretical concepts and
                practical applications
              </li>
              <li>
                Guided students in building real-world projects, focusing on
                data collection, cleaning, and visualization to develop their
                skills
              </li>
              <li>
                Provided one-on-one mentoring and support to students, helping
                them apply data science methods to solve real-world challenges
              </li>
              <li>
                Developed assessment materials and graded assignments to track
                students' progress and mastery of the course content
              </li>
            </ul>
          ),
        },
        {
          position: "Part-time Data Analyst",
          company: "Collective Routes",
          date: "April 2023 – April 2025 | Giza, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Conducted quantitative data analysis for research projects at
                Collective Routes, utilizing Excel and Power BI
              </li>
              <li>
                Analyzed research data to generate statistical reports and
                extract valuable insights
              </li>
              <li>
                Designed interactive dashboards using Power BI to visually
                communicate research findings effectively
              </li>
              <li>
                Provided training sessions on Power BI usage, empowering
                researchers to analyze and present data proficiently
              </li>
            </ul>
          ),
        },
        {
          position: "Senior Data Analyst and Researcher",
          company: "DADRI Data Research Institute",
          date: "January 2019 – October 2022 | Giza, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Managed 19 social dataset projects utilizing Excel and Power BI
                to collect and analyze over 10,000 data points, resulting in
                accurate information indicators and forecasts
              </li>
              <li>
                Established and oversaw the "Modern Egypt program," which
                launched databases for modern Egypt's social history
              </li>
              <li>
                Led and trained a team of 3 members, increasing their technical
                capabilities and improving project efficiency by 15%
              </li>
              <li>
                Conducted multiple workshops on advanced Excel skills, dataset
                building, and analysis, resulting in a 50% increase in
                participants' data analysis abilities
              </li>
            </ul>
          ),
        },
        {
          position: "Junior Data Analyst and Researcher",
          company: "DADRI Data Research Institute",
          date: "September 2017 – December 2018 | Giza, Egypt",
          description: (
            <ul className="list-disc list-outside ml-5 space-y-2 text-gray-300">
              <li>
                Analyzed 5 social dataset projects using Excel and Power BI with
                95% accuracy, totaling 5,000 data points
              </li>
              <li>
                Conducted exploratory studies and literature reviews to support
                project objectives
              </li>
              <li>
                Authored and prepared 20+ technical, research, and evaluation
                papers and reports, achieving an average rating of 4.5 out of 5
                from project stakeholders
              </li>
            </ul>
          ),
        },
      ],
    },

    // 3. Technical Skills
    {
      title: "Technical Skills",
      icon: ResumeIcons.skills,
      items: [
        {
          position: "Core Skills",
          company: "",
          date: "",
          description: (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Python",
                "SQL",
                "Microsoft Excel",
                "Power BI & DAX Language",
                "Tableau",
                "Data Analytics",
                "Data Visualization",
                "Data Modeling",
                "Data Cleansing",
                "Exploratory Data Analysis",
                "Microsoft Power Query",
                "SQL Server (SSIS, SSAS, SSRS)",
                "Power Automate",
                "N8N",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 rounded-lg border border-blue-500/30 text-sm font-medium text-center hover:border-blue-500/60 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ),
        },
      ],
    },

    // 4. Top Projects
    {
      title: "Top Projects",
      icon: ResumeIcons.projects,
      items: [
        {
          position: "Power BI Sales Report",
          company: "Power BI, Power Query",
          date: "",
          description: (
            <p className="text-gray-300">
              This project presents an interactive Sales Dashboard built with
              Power BI to analyze sales performance across countries.
            </p>
          ),
        },
        {
          position: "Forecasting Website Traffic - Case Study",
          company:
            "Python, Pandas, NumPy, Matplotlib, Seaborn, Statsmodels, Plotly",
          date: "",
          description: (
            <p className="text-gray-300">
              This project develops a time series forecasting model to predict
              website traffic for TheCleverProgrammer.com. The analysis covers
              visitor data from June 2021 to June 2022, with the goal of
              understanding traffic patterns and building accurate predictions
              for future periods.
            </p>
          ),
        },
        {
          position: "Diamond Price Analysis and Forecasting",
          company:
            "Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Plotly",
          date: "",
          description: (
            <p className="text-gray-300">
              This project focuses on analyzing diamond prices based on their
              characteristics (carat, cut, color, clarity, etc.) and building a
              predictive model to estimate diamond prices.
            </p>
          ),
        },
        {
          position: "Airlines Loyalty - PlacementDost Internship",
          company: "Power BI, Excel, Power Query",
          date: "",
          description: (
            <p className="text-gray-300">
              This project involved analyzing data related to customer behavior,
              flight activity, loyalty history, and calendar events using Power
              BI and MS Excel to derive actionable insights to optimize customer
              engagement, loyalty programs, and revenue generation.
            </p>
          ),
        },
        {
          position: "Craigslist Used Vehicles Dataset Analysis",
          company:
            "Python, Jupyter Notebook, Pandas, NumPy, Matplotlib, Seaborn",
          date: "December 2024",
          description: (
            <p className="text-gray-300">
              Craigslist Used Vehicles project gathers used vehicle listings
              across the U.S. from Craigslist using a custom scraper, providing
              a dataset with over 18 categories of information such as price,
              condition, manufacturer, and location.
            </p>
          ),
        },
        {
          position: "Restaurant Orders - PlacementDost Internship",
          company: "MySQL",
          date: "",
          description: (
            <p className="text-gray-300">
              Developed a comprehensive restaurant management system using MS
              SQL. Created and populated tables within the SQL database and
              performed various SQL queries to retrieve, analyze, modify, and
              manage restaurant data effectively.
            </p>
          ),
        },
        {
          position: "HR Employee Survey Responses - PlacementDost Internship",
          company: "Excel, Power Query",
          date: "",
          description: (
            <p className="text-gray-300">
              Analyzed employee survey data using Microsoft Excel to derive
              meaningful insights regarding employee satisfaction and areas for
              improvement within the organization.
            </p>
          ),
        },
        {
          position: "Diabetes Prediction Model using Regression",
          company: "Python, Regression, Jupyter Notebook",
          date: "",
          description: (
            <p className="text-gray-300">
              Developed a predictive model to determine whether a patient has
              diabetes based on diagnostic measurements from the National
              Institute of Diabetes and Digestive and Kidney Diseases dataset.
            </p>
          ),
        },
        {
          position: "Restoring Maji Ndogo's Water Access",
          company: "SQL, MySQL, Jupyter Notebook",
          date: "ExploreAI Academy Data Science Program Project",
          description: (
            <p className="text-gray-300">
              Addressed the water crisis in Maji Ndogo through comprehensive SQL
              analysis, leveraging data-driven solutions to understand water
              access issues and assess water quality.
            </p>
          ),
        },
        {
          position: "TMDB Movie Database",
          company: "SQL, MySQL, Jupyter Notebook",
          date: "ExploreAI Academy Data Science Program Project",
          description: (
            <p className="text-gray-300">
              This project centers around a movie database containing
              comprehensive information about movies, including titles, release
              dates, actors, genres, awards, and more.
            </p>
          ),
        },
      ],
    },

    // 5. Courses & Certificates
    {
      title: "Courses & Certificates",
      icon: ResumeIcons.certificates,
      items: [
        {
          position: "Data Science Program",
          company: "ExploreAI & ALX Academy",
          date: "May 2023 – August 2024",
          description: (
            <p className="text-gray-300">
              Rigorous, hands-on course covering Python, SQL, machine learning
              (regression and classification), data visualization (Matplotlib
              and Seaborn), data wrangling, cleaning, and statistical analysis.
              Applied data science methodologies to solve business problems and
              provide data-driven insights.
            </p>
          ),
        },
        {
          position: "Data Science & Machine Learning Certificate",
          company: "Microsoft Student Club – EELU",
          date: "October 2024 – February 2025",
          description: (
            <p className="text-gray-300">
              Completed a 5-month intensive program covering Python
              fundamentals, NumPy, Pandas, Matplotlib, Power BI, machine
              learning basics, version control (Git/GitHub), and real-world
              projects to build digital and analytical skills.
            </p>
          ),
        },
        {
          position: "Data Visualization in Power BI",
          company: "DataCamp",
          date: "In Progress",
          description: (
            <p className="text-gray-300">
              Currently mastering audience-centric Power BI visualizations.
              Developing skills in emotional connection through dashboard
              elements and implementing cognitive load reduction techniques for
              enhanced data communication.
            </p>
          ),
        },
        {
          position: "Data Analysis Professional Track",
          company: "FWD & Udacity",
          date: "",
          description: (
            <p className="text-gray-300">
              Introduction to Python Programming, data analysis using Anaconda
              and Python packages, data wrangling, cleaning data using Python
              and Pandas, and data visualization.
            </p>
          ),
        },
        {
          position: "Data Analysis Challenge Track",
          company: "FWD & Udacity",
          date: "",
          description: (
            <p className="text-gray-300">
              Ask questions and answer them using data, calculate key business
              metrics in financial analysis, forecast financial metrics using
              scenario analysis, and digital freelancing.
            </p>
          ),
        },
      ],
    },

    // 6. Education
    {
      title: "Education",
      icon: ResumeIcons.education,
      items: [
        {
          position: "Bachelor's Degree",
          company:
            "Faculty of Commerce and Business Administration, Helwan University",
          date: "May 2019 | Cairo, Egypt",
          description: (
            <p className="text-gray-300">
              Graduated with a Bachelor's degree in Commerce and Business
              Administration.
            </p>
          ),
        },
      ],
    },
  ],
};

// export class ResumeDataProvider {
//   static dataSkills = SkillRepository.getSkills();
//   // static dataSkills = new SkillRepository().getSkills().data;

//   static getData() {
//     return [
//       {
//         title: "Experience",
//         icon: <i className="bx bxs-book-bookmark"></i>,
//         items: [
//           {
//             position: " WellGrow Training",
//             company: "Part time Data Analysis Instructor",
//             date: "Apr 2024 – present",
//             link: "",
//             description: (
//               <ul className="list-disc space-y-4">
//                 <li>
//                   Delivered comprehensive training on essential data analysis
//                   tools such as Python, SQL, Power BI, and Excel, equipping
//                   students with both theoretical knowledge and hands-on
//                   experience to tackle real-world data challenges effectively.
//                 </li>

//                 <li>
//                   Designed and implemented interactive instructional materials
//                   and projects that emphasized practical applications of data
//                   collection, cleaning, and visualization techniques, enhancing
//                   students' ability to analyze and interpret complex
//                   datasets.{" "}
//                 </li>

//                 <li>
//                   {" "}
//                   Provided personalized mentorship and feedback to students,
//                   guiding them in applying data science methodologies to solve
//                   industry specific problems while developing assessments to
//                   evaluate their progress and mastery of course content.
//                 </li>
//               </ul>
//             ),
//             // "During my internship at DEPI, I gained extensive knowledge in Machine Learning, applied various ML techniques, and worked on numerous projects that enhanced my practical skills.",
//           },
//           {
//             position: "NeuroTech",
//             company: "Part time Data Analysis Instructor",
//             date: "Dec 2024 – present",
//             link: "",
//             description: (
//               <ul className="list-disc space-y-4">
//                 <li>
//                   Taught key data analysis tools and techniques, including
//                   Python, statistics, SQL, Power BI, and Excel, to students in
//                   the diploma.
//                 </li>

//                 <li>
//                   Designed and delivered instructional materials for each
//                   module, ensuring a deep understanding of both theoretical
//                   concepts and practical applications.
//                 </li>

//                 <li>
//                   Guided students in building real-world projects, focusing on
//                   data collection, cleaning, and visualization to develop their
//                   skills.
//                 </li>

//                 <li>
//                   Provided one-on-one mentoring and support to students, helping
//                   them apply data science methods to solve real-world
//                   challenges.
//                 </li>

//                 <li>
//                   Developed assessment materials and graded assignments to track
//                   students' progress and mastery of the course content.
//                 </li>
//               </ul>
//             ),
//           },

//           {
//             position: "Collective Routes",
//             company: "Part time Data Analyst",
//             date: "Apr 2023 – present",
//             link: "",
//             description: (
//               <ul className="list-disc space-y-4">
//                 <li>
//                   Conducted quantitative data analysis for research projects at
//                   Collective Routes, utilizing Excel and Power BI.
//                 </li>

//                 <li>
//                   Analyzed research data to generate statistical reports and
//                   extract valuable insights.
//                 </li>

//                 <li>
//                   Designed interactive dashboards using Power BI to visually
//                   communicate research findings effectively.
//                 </li>

//                 <li>
//                   Provided training sessions on Power BI usage, empowering
//                   researchers to analyze and present data proficiently.
//                 </li>
//               </ul>
//             ),
//           },

//           {
//             position: "Senior Data Analyst and Researcher",
//             company: "DADRI Data Research Institute",
//             date: "Jan 2019 – Oct 2022",
//             link: "",
//             description: (
//               <ul className="list-disc space-y-4">
//                 <li>
//                   Managed 19 social dataset projects utilizing Excel and Power
//                   BI to collect and analyze over 10,000 data points, resulting
//                   in accurate information indicators and forecasts.
//                 </li>

//                 <li>
//                   Established and oversaw the "Modern Egypt program," which
//                   launched databases for modern Egypt's social history.
//                 </li>

//                 <li>
//                   Led and trained a team of 3 members, increasing their
//                   technical capabilities and improving project efficiency by
//                   15%.
//                 </li>
//                 <li>
//                   Conducted multiple workshops on advanced Excel skills, dataset
//                   building, and analysis, resulting in a 50% increase in
//                   participants' data analysis abilities.
//                 </li>
//               </ul>
//             ),
//           },

//           {
//             position: "Junior Data Analyst and Researcher",
//             company: "DADRI Data Research Institute",
//             date: "Sep 2017 – Dec 2018",
//             link: "",
//             description: (
//               <ul className="list-disc space-y-4">
//                 <li>
//                   Analyzed 5 social dataset projects using Excel and Power BI
//                   with 95% accuracy, totaling 5,000 data points.
//                 </li>

//                 <li>
//                   Conducted exploratory studies and literature reviews to
//                   support project objectives.
//                 </li>
//                 <li>
//                   Authored and prepared 20+ technical, research, and evaluation
//                   papers and reports, achieving an average rating of 4.5 out of
//                   5 from project stakeholders.
//                 </li>
//               </ul>
//             ),
//           },
//         ],
//       },

//       {
//         title: "Technical Skills",
//         icon: <FaBookmark />,
//         items: [
//           {
//             // position: " WellGrow Training",
//             // company: "Part time Data Analysis Instructor",
//             // date: "May 2024 — October 2024",
//             // link: "",
//             description: (
//               <ul className="list-disc space-y-4 grid grid-cols-2 gap-4">
//                 {ResumeDataProvider.dataSkills.map((skill, index) => (
//                   <li key={index} className="flex items-center gap-2">
//                     {skill.icon}
//                     <span>{skill.skill_name}</span>
//                   </li>
//                 ))}
//               </ul>
//             ),
//           },
//         ],
//       },

//       {
//         title: "Courses & Certificates",
//         icon: <i className="bx bxs-book-bookmark"></i>,
//         items: [
//           {
//             position: "Data Science program",
//             company: "ExploreAI & ALX Academy",
//             // date: "May 2023 – Aug 2024",
//             link: "",
//             description: `The ALX Data Science Program is a rigorous, hands-on course that taught me strong data analysis and data science skills. I gained
// proficiency in Python, SQL, and machine learning techniques such as regression and classification. I also developed expertise in data
// visualization using Matplotlib and Seaborn, enabling me to turn complex datasets into actionable insights. I completed real-world projects
// on data wrangling, cleaning, and statistical analysis during the program. I applied data science methodologies to solve business problems
// and provide data-driven insights, enhancing my ability to analyze large datasets and present findings.`,
//           },
//           {
//             position: "Data Visualization in Power BI",
//             company: "DataCamp",
//             // date: "May 2024 — October 2024",
//             link: "",
//             description: `Currently mastering audience-centric Power BI visualizations for clear and relevant insights. Developing skills in emotional connection
// through ongoing exploration of concise dashboard elements like bar charts and small multiples. Actively exploring and implementing
// cognitive load reduction techniques in Power BI for enhanced data communication.`,
//           },

//           {
//             position: " Data analysis professional track",
//             company: "FWD & Udacity",
//             // date: "May 2024 — October 2024",
//             link: "",
//             description: `Introduction to Python Programming. Introduction to Data Analysis using Anaconda and Python data analysis packages. Data Wrangling,
// Clean data using Python and Pandas, and data visualization using Python.`,
//           },

//           {
//             position: "Intro to Descriptive Statistics",
//             company: "udacity",
//             // date: "May 2024 — October 2024",
//             link: "",
//             description: `Intro to Research Methods. Create and interpret histograms, bar charts, and frequency plots. Central Tendency, Variability, Standardizing,
// Normal Distribution, Sampling Distributions.`,
//           },

//           {
//             position: " Data analysis challenge track",
//             company: "FWD & Udacity",
//             // date: "May 2024 — October 2024",
//             link: "",
//             description: `Ask questions and answer them using data. Calculate key business metrics in financial analysis and interpret the values. Forecast financial
// metrics using scenario analysis, Digital Freelancing and the used platforms "globally and in the Arab world", and build an identity to work
// as a freelancer.`,
//           },

//           {
//             position: "Data Scientist Associate certificate",
//             company: "DataCamp",
//             // date: "May 2024 — October 2024",
//             link: "",
//             description: `Advanced SQL, including clauses, operators, functions, subqueries, joins, and data modification techniques. Data retrieval, analysis, and
// manipulation with advanced techniques applied in a data science context`,
//           },
//         ],
//       },
//     ];
//   }
// }
