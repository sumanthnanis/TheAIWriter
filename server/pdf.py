from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import chat_agent_executor
from langchain_core.messages import HumanMessage
from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from fpdf import FPDF

api_key = "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"
search = TavilySearchAPIWrapper(tavily_api_key=api_key)
tavily_tool = TavilySearchResults(api_wrapper=search)
tools = [tavily_tool]

model = ChatOpenAI(model='gpt-3.5-turbo-1106', temperature=1, api_key="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")
connect = chat_agent_executor.create_function_calling_executor(model, tools)

template = """You are an AI research paper writer assistant. Use the provided tools based on the query or input if needed. You have access to the tools: \n---\n Tavily Search Tool \n---\n "You should provide accurate data on the research topic. At least 1 page should be the content." \n---\n Rule 1: Don't generate links in between sections. Only generate links in the reference section. Here is the user's problem statement - """
qe = """Based on the user's input, you should write the research paper. If you want to leave a place for images or anything, just say <----- title ----->, Here is the User's question - """

def process_file():
    # print("Research")
    with open('paper.txt','r') as fr:
        problem_statement_lines = fr.readlines()
    problem_statement = ''.join(problem_statement_lines)

    list1 = ['Introduction', 'Methodology', 'Results', 'Conclusion', 'References', 'Appendices']
    ert = 'write the ' + 'abstract' + ' for it. Giving heading as abstract for it'
    inputs = {"messages": [HumanMessage(content=template + ''.join(problem_statement) + qe + ert)]}
    wd = connect.invoke(inputs)['messages'][-1].content

    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(left=20, right=20, top=20)
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Research Paper Title', align='C')
    pdf.ln(20)

    # Abstract
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Abstract')
    pdf.ln(10)
    pdf.set_font('Arial', '', 12)
    split_text = wd.split('\n')
    for line in split_text:
        pdf.multi_cell(0, 5, line)
    pdf.ln(10)

    for i in list1:
        ert = qe + 'write the ' + i + ' for it'
        inputs = {"messages": [HumanMessage(content=template + ''.join(problem_statement) + ert)]}
        wd = connect.invoke(inputs)['messages'][-1].content

        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, i.capitalize())
        pdf.ln(10)
        pdf.set_font('Arial', '', 12)
        split_text = wd.split('\n')
        for line in split_text:
            pdf.multi_cell(0, 5, line)
        pdf.ln(10)

    pdf.output('research_paper.pdf')
    print("Research paper generated successfully: Backend")

if __name__ == '__main__':
    process_file()
