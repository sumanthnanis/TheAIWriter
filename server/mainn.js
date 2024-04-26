// Importing necessary modules and defining variables
const fs = require("fs");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  TavilySearchAPIWrapper,
  TavilySearchResults,
} = require("langchain_community/tools/tavily_search");
const { chat_agent_executor } = require("langgraph/prebuilt");
const { HumanMessage } = require("langchain_core/messages");

const api_key = "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";
const search = new TavilySearchAPIWrapper(api_key);
const tavily_tool = new TavilySearchResults({ api_wrapper: search });

const tools = [tavily_tool];

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo-1106",
  temperature: 1,
  api_key: "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",
});

const app = chat_agent_executor.create_function_calling_executor(model, tools);

const template = `
    You are an AI research paper writer assistant. 

    Use the provided tools based on the query or input if needed.

    You have access to the tools:
    ---
    Tavily Search Tool
    ---
    "You should provide accurate data on the research topic. At least 1 page should be the content."
    ---
    Rule 1: Don't generate the links in between sections only generate links in the reference section.

    Here is the user's problem statement - 
`;

const qe = `Based on the user's input, you should write the research paper. If you want to leave a place for images or anything, just say <----- title ----->.
            Here is the User's question - `;

// Read the lines from the file and concatenate them into a single string
const problemStatementLines = fs.readFileSync("paper.txt", "utf8");
const problemStatement = problemStatementLines.join("");

const list1 = [
  "Introduction",
  "Methodology",
  "Results",
  "Conclusion",
  "References",
  "Appendices",
];

let formatedText = "";

const ert =
  "write the " + "abstract" + "for it Giving heading as abstract for it";
const inputs = {
  messages: [
    new HumanMessage({ content: template + problemStatement + qe + ert }),
  ],
};
const wd = app.invoke(inputs)["messages"].slice(-1)[0].content;

fs.writeFileSync("fr1.txt", wd);

const data = fs.readFileSync("fr1.txt", "utf8");

for (const section of list1) {
  const ert = qe + "write the " + section + " for it";
  const inputs = {
    messages: [
      new HumanMessage({ content: template + problemStatement + ert }),
    ],
  };
  const wd = app.invoke(inputs)["messages"].slice(-1)[0].content;
  fs.appendFileSync("fr1.txt", wd);
}

console.log(data);

const text = `The development of e-commerce mobile applications has become increasingly important in providing a platform for selling products, especially for Self Help Groups (SHGs) trained to create unique products. This research paper explores the use of Flutter, Dart, Node.js, and MySQL as the key technologies in the development of an e-commerce mobile application for SHGs. These technologies offer efficient cross-platform development, clean and maintainable code, scalability, and a structured database for product visualization. This paper presents a comprehensive overview of the e-commerce mobile application development process and the technologies involved.`;

function splitTextIntoLines(text, wordsPerLine) {
  const words = text.split(" ");
  const lines = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }
  return lines.join("\n");
}

const wordsPerLine = 11;
const formattedText = splitTextIntoLines(text, wordsPerLine);

fs.writeFileSync("output.txt", formattedText);

console.log("Text saved to 'output.txt'");
