import PageLayout from "@/layout/PageLayout";
import { ResumeDataProvider } from "@/store/dataClasses";

// استيراد الأيقونات من Lucide React
import {
  Code2,
  Database,
  BarChart3,
  TrendingUp,
  Cpu,
  LineChart,
  FileSpreadsheet,
  Table,
  Filter,
  PieChart,
  Brain,
  Settings,
  Server,
  Zap,
  Workflow,
  Terminal,
} from "lucide-react";

function splitIntoParagraphs(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs = [];
  let currentParagraph = "";

  sentences.forEach((sentence) => {
    if ((currentParagraph + sentence).length <= maxLength) {
      currentParagraph += sentence + " ";
    } else {
      if (currentParagraph) paragraphs.push(currentParagraph.trim());
      currentParagraph = sentence + " ";
    }
  });

  if (currentParagraph) paragraphs.push(currentParagraph.trim());

  return paragraphs.length > 0 ? paragraphs : [text];
}
// دالة لعرض النص مقسماً إلى فقرات
function ReadableText({ text, className = "", maxLength = 300 }) {
  if (!text || text.trim() === "") return null;

  // إذا كان النص قصيراً، اعرضه كفقرة واحدة
  if (text.length < maxLength) {
    return (
      <p className={`text-gray-300 leading-relaxed ${className}`}>{text}</p>
    );
  }

  // قسم النص إلى فقرات
  const paragraphs = splitIntoParagraphs(text, 2);

  if (paragraphs.length === 1) {
    return (
      <p className={`text-gray-300 leading-relaxed ${className}`}>{text}</p>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-gray-300 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function IconBox({ icon, className }) {
  return (
    <div className={`icon-box ${className}`}>
      <div className="relative text-yellow-crayola rounded-xl w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-1 bg-eerie-black-1 rounded-xl z-0 border-t border-l border-dark-charcoal"></div>
        <div className="z-10">{icon}</div>
      </div>
    </div>
  );
}

// مكون SkillIcon لتعيين الأيقونات للمهارات
function SkillIcon({ skillName, className = "w-5 h-5" }) {
  const skillIcons = {
    "Programming & Databases": <Terminal className={className} />,
    // Programming & Languages
    Python: <Code2 className={className} />,
    SQL: <Database className={className} />,
    MySQL: <Database className={className} />,

    // Databases & Servers
    "SQL Server (SSIS, SSAS, SSRS)": <Server className={className} />,
    "SQL Server": <Server className={className} />,

    // Automation & Workflow
    N8N: <Workflow className={className} />,
    "Power Automate": <Zap className={className} />,

    // Data Analysis & BI
    "Power BI & DAX Language": <BarChart3 className={className} />,
    "Power BI": <BarChart3 className={className} />,
    Tableau: <PieChart className={className} />,
    "Microsoft Excel": <FileSpreadsheet className={className} />,
    Excel: <FileSpreadsheet className={className} />,
    "Power Query": <Filter className={className} />,

    // Data Science & Analytics
    "Data Analytics": <TrendingUp className={className} />,
    "Data Visualization": <LineChart className={className} />,
    "Data Cleansing": <Filter className={className} />,
    "Data Modeling": <Table className={className} />,
    "Exploratory Data Analysis": <Brain className={className} />,
    Statistics: <Cpu className={className} />,
    Regression: <TrendingUp className={className} />,
  };

  // البحث عن الأيقونة المناسبة
  for (const [key, icon] of Object.entries(skillIcons)) {
    if (skillName.toLowerCase().includes(key.toLowerCase().split(" ")[0])) {
      return icon;
    }
  }

  // أيقونة افتراضية
  return <Settings className={className} />;
}

function ResumeItemComponent({ obj, type = "experience" }) {
  return (
    <div className="mb-8 p-6 drop-shadow-lg bg-light rounded-xl transition-all duration-300">
      {type === "experience" && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <h3 className="text-xl font-bold text-dark">{obj.position}</h3>
            <span className="text-yellow-crayola font-semibold text-sm mt-1 md:mt-0">
              {obj.date}
            </span>
          </div>
          <h4 className="text-yellow-crayola font-bold mb-4 text-lg">
            {obj.company} | {obj.location}
          </h4>
          <div className="space-y-2 text-gray-300">
            {obj.description?.map((item, index) => (
              <p key={index} className="flex items-start">
                <span className="text-yellow-crayola mr-2">•</span>
                {item}
              </p>
            ))}
          </div>
        </>
      )}

      {type === "project" && (
        <>
          <h3 className="text-xl font-bold text-dark mb-3">{obj.name}</h3>
          {obj.date && (
            <p className="text-vegas-gold font-semibold text-sm mb-2">
              {obj.date}
            </p>
          )}
          <div className="flex gap-2 mb-4">
            {obj.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-jet text-vegas-gold rounded-full text-sm border border-dark-charcoal flex items-center gap-1"
              >
                <SkillIcon skillName={tech} className="w-3 h-3" />
                {tech}
              </span>
            ))}
          </div>
          <ReadableText text={obj.description} className="mt-2" />
        </>
      )}

      {type === "education" && (
        <>
          <h3 className="text-xl font-bold text-dark mb-2">{obj.degree}</h3>
          <h4 className="text-yellow-crayola font-bold mb-2">
            {obj.institution}
          </h4>
          <p className="text-vegas-gold font-semibold mb-3">
            {obj.date} | {obj.location}
          </p>
          {obj.description && obj.description.trim() !== "" && (
            <ReadableText text={obj.description} className="mt-2" />
          )}
        </>
      )}

      {type === "certificate" && (
        <>
          <h3 className="text-xl font-bold text-dark mb-2">{obj.name}</h3>
          <h4 className="text-yellow-crayola font-bold mb-2">{obj.issuer}</h4>
          <p className="text-vegas-gold font-semibold mb-3">{obj.date}</p>
          <ReadableText text={obj.description} className="mt-2" />
        </>
      )}
    </div>
  );
}

function SkillsSection({ skills }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills?.map((skill, index) => (
        <div
          key={index}
          className="p-4 bg-light drop-shadow-md rounded-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg border border-dark">
              <SkillIcon
                skillName={skill.category}
                className="w-6 h-6 text-yellow-crayola"
              />
            </div>
            <h3 className="font-bold text-yellow-crayola text-lg">
              {skill.category}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {skill.items?.map((item, itemIndex) => (
              <span
                key={itemIndex}
                className="px-3 py-2 bg-charcoal-black text-dark rounded-lg text-sm border border-dark flex items-center gap-2 hover:text-light hover:bg-dark transition-colors duration-200"
              >
                <SkillIcon
                  skillName={item}
                  className="w-4 h-4 text-yellow-crayola"
                />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Resume() {
  const data = ResumeDataProvider.getData();

  // تنظيم البيانات حسب الأقسام الجديدة
  const resumeData = {
    summary: {
      title: "Summary",
      content:
        "Detail-oriented Data Analyst with expertise in SQL, Excel, Power BI, and Python, dedicated to translating complex datasets into clear, impactful insights. Skilled in data visualization, simplifying technical findings for diverse audiences, and uncovering hidden patterns beyond raw numbers. Adept at storytelling with data, crafting compelling narratives that drive informed decision-making. Experienced in designing interactive dashboards, conducting training sessions, and collaborating across teams to enhance data-driven strategies. Passionate about delivering actionable insights that bridge the gap between data and decision-makers.",
    },
    experiences: [
      {
        position: "Data Analyst",
        company: "Shiny White Dental Centers",
        location: "Cairo, Egypt",
        date: "May 2025 – Present",
        description: [
          "Develop forecasting models using Python (Pandas, Statsmodels) to predict, enabling proactive planning and optimized scheduling.",
          "Collaborate with the finance team to analyze and manage monthly budgets and financial statements, ensuring data accuracy and supporting cost-reduction initiatives.",
          "Design dynamic dashboards in Power BI to track KPIs.",
          "Automated financial and operational reporting workflows using Power BI and Python.",
          "Provided data-driven recommendations that improved budget allocation and enhanced visibility for senior management.",
        ],
      },
      {
        position: "Data Analytics Instructor",
        company: "CLS – Digital Egypt Pioneers Initiative (DEPI)",
        location: "Cairo, Egypt",
        date: "December 2025 – Present",
        description: [
          "Delivered training on data analytics fundamentals, data-driven decision-making, and Excel-based visualizations for DEPI participants.",
          "Taught Power BI end-to-end: data extraction, Power Query cleaning, data modeling, DAX, and interactive dashboard/report development.",
          "Introduced Azure data services, Tableau visualization, and data governance concepts, and supervised capstone projects using real-world datasets.",
        ],
      },
      {
        position: "Data Analysis Instructor",
        company: "IMP - Institute of Management Professionals",
        location: "Cairo, Egypt",
        date: "October 2025 – Present",
        description: [
          "Delivered advanced Excel training on Power Query, Power Pivot, and DAX language for data modeling.",
          "Conducted Power BI sessions covering DAX time intelligence, calculated columns, and performance optimization techniques.",
          "Mentored students in complex data modeling, relationship management, and Microsoft Power BI certification preparation.",
          "Provided supplementary training on SQL for data analysis, Python data manipulation with Pandas, and Power Automate workflow automation.",
        ],
      },
      {
        position: "Part time Data Analysis Instructor",
        company: "NeuroTech",
        location: "Cairo, Egypt",
        date: "December 2024 – October 2025",
        description: [
          "Taught key data analysis tools and techniques, including Python, statistics, SQL, Power BI, and Excel, to students in the diploma.",
          "Designed and delivered instructional materials for each module, ensuring a deep understanding of both theoretical concepts and practical applications.",
          "Guided students in building real-world projects, focusing on data collection, cleaning, and visualization to develop their skills.",
          "Provided one-on-one mentoring and support to students, helping them apply data science methods to solve real-world challenges.",
          "Developed assessment materials and graded assignments to track students' progress and mastery of the course content.",
        ],
      },
      {
        position: "Part time Data Analyst",
        company: "Collective Routes",
        location: "Giza, Egypt",
        date: "April 2023 – April 2025",
        description: [
          "Conducted quantitative data analysis for research projects at Collective Routes, utilizing Excel and Power BI.",
          "Analyzed research data to generate statistical reports and extract valuable insights.",
          "Designed interactive dashboards using Power BI to visually communicate research findings effectively.",
          "Provided training sessions on Power BI usage, empowering researchers to analyze and present data proficiently.",
        ],
      },
      {
        position: "Senior Data Analyst and Researcher",
        company: "DADRI Data Research Institute",
        location: "Giza, Egypt",
        date: "January 2019 – October 2022",
        description: [
          "Managed 19 social dataset projects utilizing Excel and Power BI to collect and analyze over 10,000 data points, resulting in accurate information indicators and forecasts.",
          "Established and oversaw the 'Modern Egypt program,' which launched databases for modern Egypt's social history.",
          "Led and trained a team of 3 members, increasing their technical capabilities and improving project efficiency by 15%.",
          "Conducted multiple workshops on advanced Excel skills, dataset building, and analysis, resulting in a 50% increase in participants' data analysis abilities.",
        ],
      },
      {
        position: "Junior Data Analyst and Researcher",
        company: "DADRI Data Research Institute",
        location: "Giza, Egypt",
        date: "September 2017 – December 2018",
        description: [
          "Analyzed 5 social dataset projects using Excel and Power BI with 95% accuracy, totaling 5,000 data points.",
          "Conducted exploratory studies and literature reviews to support project objectives.",
          "Authored and prepared 20+ technical, research, and evaluation papers and reports, achieving an average rating of 4.5 out of 5 from project stakeholders.",
        ],
      },
    ],
    technicalSkills: [
      {
        category: "Programming & Databases",
        items: [
          "Python",
          "SQL",
          "SQL Server (SSIS, SSAS, SSRS)",
          "N8N",
          "Power Automate",
        ],
      },
      {
        category: "Data Analysis & Visualization",
        items: [
          "Power BI & DAX Language",
          "Tableau",
          "Microsoft Excel",
          "Power Query",
          "Data Visualization",
        ],
      },
      {
        category: "Technical Skills",
        items: [
          "Data Analytics",
          "Data Cleansing",
          "Data Modeling",
          "Exploratory Data Analysis",
          "Statistics",
        ],
      },
    ],
    certificates: [
      {
        name: "Data Science program",
        issuer: "ExploreAI & ALX Academy",
        date: "May 2023 – August 2024",
        description:
          "The ALX Data Science Program is a rigorous, hands-on course that taught me strong data analysis and data science skills. I gained proficiency in Python, SQL, and machine learning techniques such as regression and classification. I also developed expertise in data visualization using Matplotlib and Seaborn, enabling me to turn complex datasets into actionable insights. I completed real-world projects on data wrangling, cleaning, and statistical analysis during the program. I applied data science methodologies to solve business problems and provide data-driven insights, enhancing my ability to analyze large datasets and present findings.",
      },
      {
        name: "Data Science & Machine Learning Certificate",
        issuer: "Microsoft Student Club – EELU",
        date: "October 2024 – February 2025",
        description:
          "Completed a 5-month intensive program covering key data science tools and concepts including Python fundamentals, NumPy, Pandas, Matplotlib, Power BI, and machine learning basics. The program emphasized hands-on learning, version control (Git/GitHub), and real-world projects to build digital and analytical skills relevant to the job market. Developed a strong foundation in data analysis and applied these skills in community and academic contexts.",
      },
      {
        name: "Data Visualization in Power BI",
        issuer: "DataCamp",
        date: "Currently Enrolled",
        description:
          "Currently mastering audience-centric Power BI visualizations for clear and relevant insights. Developing skills in emotional connection through ongoing exploration of concise dashboard elements like bar charts and small multiples. Actively exploring and implementing cognitive load reduction techniques in Power BI for enhanced data communication.",
      },
      {
        name: "Data analysis professional track",
        issuer: "FWD & Udacity",
        date: "",
        description:
          "Introduction to Python Programming. Introduction to Data Analysis using Anaconda and Python data analysis packages. Data Wrangling, Clean data using Python and Pandas, and data visualization using Python.",
      },
      {
        name: "Data analysis challenge track",
        issuer: "FWD & Udacity",
        date: "",
        description:
          "Ask questions and answer them using data. Calculate key business metrics in financial analysis and interpret the values. Forecast financial metrics using scenario analysis, Digital Freelancing and the used platforms 'globally and in the Arab world', and build an identity to work as a freelancer.",
      },
      {
        name: "Intro to Descriptive Statistics",
        issuer: "Udacity",
        date: "",
        description:
          "Intro to Research Methods. Create and interpret histograms, bar charts, and frequency plots. Central Tendency, Variability, Standardizing, Normal Distribution, Sampling Distributions.",
      },
    ],
    education: [
      {
        degree: "Bachelor's degree",
        institution:
          "Faculty of Commerce and Business Administration, Helwan University",
        location: "Cairo, Egypt",
        date: "May 2019",
        description: "",
      },
    ],
  };

  return (
    <PageLayout title="Resume">
      <div className="space-y-12">
        {/* Summary Section */}
        <div className="relative flex items-start gap-7">
          <IconBox icon={data?.[0]?.icon} className="max-md:hidden" />
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-yellow-crayola flex items-center gap-1">
              <IconBox icon={data?.[0]?.icon} className="md:hidden" />
              {resumeData.summary.title}
            </h3>
            <div className="text-gray-300 text-lg space-y-4">
              {splitIntoParagraphs(resumeData.summary.content, 250).map(
                (paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>

        <hr className="border-dark-charcoal" />

        {/* Experiences Section */}
        <div className="relative flex items-start gap-7">
          <IconBox icon={data?.[1]?.icon} className="max-md:hidden" />
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-yellow-crayola flex items-center gap-1">
              <IconBox icon={data?.[1]?.icon} className="md:hidden" />
              Experiences
            </h3>
            <div className="space-y-6">
              {resumeData.experiences.map((experience, index) => (
                <div className="relative resume-icon timeline-item" key={index}>
                  <ResumeItemComponent obj={experience} type="experience" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-dark-charcoal" />

        {/* Technical Skills Section */}
        <div className="relative flex items-start gap-7">
          <IconBox icon={data?.[2]?.icon} className="max-md:hidden" />
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-yellow-crayola flex items-center gap-1">
              <IconBox icon={data?.[2]?.icon} className="md:hidden" />
              Technical Skills
            </h3>
            <SkillsSection skills={resumeData.technicalSkills} />
          </div>
        </div>

        <hr className="border-dark-charcoal" />

        {/* Certificates Section */}
        <div className="relative flex items-start gap-7">
          <IconBox icon={data?.[3]?.icon} className="max-md:hidden" />
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-yellow-crayola flex items-center gap-1">
              <IconBox icon={data?.[3]?.icon} className="md:hidden" />
              Courses & Certificates
            </h3>
            <div className="space-y-6">
              {resumeData.certificates.map((certificate, index) => (
                <ResumeItemComponent
                  key={index}
                  obj={certificate}
                  type="certificate"
                />
              ))}
            </div>
          </div>
        </div>

        <hr className="border-dark-charcoal" />

        {/* Education Section */}
        <div className="relative flex items-start gap-7">
          <IconBox icon={data?.[4]?.icon} className="max-md:hidden" />
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-yellow-crayola flex items-center gap-1">
              <IconBox icon={data?.[4]?.icon} className="md:hidden" />
              Education
            </h3>
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <ResumeItemComponent key={index} obj={edu} type="education" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
