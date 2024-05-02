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
# from flask import Flask, request, jsonify
# import random
# import string
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  

# @app.route('/process_file', methods=['POST'])
# def process_file():
#     file = request.files['file']
#     file_content = file.read().decode('utf-8')

#     # Modify the text with random characters
#     modified_text = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(len(file_content)))

#     return jsonify({'modified_text': modified_text})

# if __name__ == '__main__':
#     app.run(port=5003,debug=True)

# from langchain_openai import ChatOpenAI
# from langchain_community.tools.tavily_search import TavilySearchResults
# from langgraph.prebuilt import chat_agent_executor
# from langchain_core.messages import HumanMessage
# from langchain.utilities.tavily_search import TavilySearchAPIWrapper
# from fpdf import FPDF
# import string
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# connect = chat_agent_executor.create_function_calling_executor(model, tools)
# template = """You are an AI research paper writer assistant. Use the provided tools based on the query or input if needed. You have access to the tools: \n---\n Tavily Search Tool \n---\n "You should provide accurate data on the research topic. At least 1 page should be the content." \n---\n Rule 1: Don't generate links in between sections. Only generate links in the reference section. Here is the user's problem statement - """
# qe = """Based on the user's input, you should write the research paper. If you want to leave a place for images or anything, just say <----- title ----->, Here is the User's question - """

# app = Flask(__name__)
# CORS(app)

# @app.route('/process_file', methods=['POST'])
# def process_file():
#     file = request.files['file']
#     file_content = file.read().decode('utf-8')
#     problem_statement = [file_content]

#     list1 = ['Introduction','Methodology','Results','Conclusion','References','Appendices']
#     ert = 'write the ' + 'abstract' + ' for it. Giving heading as abstract for it'
#     inputs = {"messages": [HumanMessage(content=template + ''.join(problem_statement) + qe + ert)]}
#     wd = connect.invoke(inputs)['messages'][-1].content

#     with open('fr1.txt', 'w') as f:
#         f.write(wd)

#     with open('fr1.txt', 'r') as f:
#         data = f.readlines()

#     for i in list1:
#         ert = qe + 'write the ' + i + ' for it'
#         inputs = {"messages": [HumanMessage(content=template + ''.join(problem_statement) + ert)]}
#         wd = connect.invoke(inputs)['messages'][-1].content
#         with open('fr1.txt', 'a') as f:
#             f.write('\n\n'+wd)

#     with open('fr1.txt', 'r') as f:
#         modified_content = f.read()
#     print("paper generated successfully:  Backend")
#     return jsonify({'modified_content': modified_content})

# if __name__ == '__main__':
#     app.run(port=5005,debug=True)

# from langchain_openai import ChatOpenAI
# from langchain_community.tools.tavily_search import TavilySearchResults
# from langgraph.prebuilt import chat_agent_executor
# from langchain_core.messages import HumanMessage
# from langchain.utilities.tavily_search import TavilySearchAPIWrapper
# from fpdf import FPDF
# import string
# from flask import Flask, request, jsonify
# from flask_cors import CORS


# connect = chat_agent_executor.create_function_calling_executor(model, tools)

# app = Flask(__name__)
# CORS(app)

# @app.route('/process_file', methods=['POST'])
# def process_file():
#     file = request.files['file']
#     file_content = file.read().decode('utf-8')
#     problem_statement = [file_content]
#     template = """
#             You are an AI research paper assistant. 
#             Your role is to guide users through the process of writing a research paper by providing relevant information, suggestions, and recommendations at each stage. 
#             You should be knowledgeable about the standard structure and components of a research paper.  

#             When generating content, do not provide references, conclusions, advantages, or disadvantages. 
#             Focus on providing guidance and advice on selecting topics, formulating research questions and hypotheses, 
#             conducting literature searches, designing appropriate research methodologies, analyzing and interpreting data, 
#             and structuring the paper effectively.Do not provide links, sources, references or citations in your generated responses.
#             and don't directly add the tool content.review it and then add it.

#             You should also be familiar with the guidelines and conventions for academic writing, such as proper citation styles, 
#             formatting requirements, and ethical considerations. 
#             Additionally, you should be able to provide advice on narrowing down research topics and 
#             conducting literature searches.
    
#             Use the provided tools based on the query or input if u needed.
            
#             you have access to the tools : \n---\n Taveily Search Tool \n---\n "you should provide accurate data  on the research topic. Atleast 1 pages should be the content" \n---\n
#             When a user provides you with a problem statement or research topic generate the content don't include problem statement as output.
#             Here is the user's problem statement - 

#     """


#     template2 = """ 


#     You are an AI research paper assistant , reviewer and writer.You just concise the content don't add new things or remove important things.

#     When generating content for this part, do not provide references, conclusions, advantages, or disadvantages,problem statement , solutions. 
#     Also Don't create subheadings,bullet points. And your generated content should be in paragraph
#     - Removing any web links, sources, references or citations 
#     - Following proper formatting, citation styles, and ethical standards for research papers

#     You should be very familiar with academic writing guidelines.

#     See you will be given problem statement plus the content you want to concise it and remove somethings has mentioned above.

#     Here is the problem statement - 

#     """

#     qe = """Based on the user's input you should write the research paper . If you want to leave a place for images or anything  just say <----- title ----->
#             Here is the User's question - """


#     # with open('./uploads/paper.txt','r') as fr:
#     #     dr = fr.readlines()

#     # fr.close()
#     # problem_statement= drs





#     list1 = ['Introduction','Literature Review','Methodology','Requirements Analysis','System Design and Architecture','Implementation and Development','Results and Evaluation','Conclusion','References']
#     # list1 = ['Introduction']
#     ert = 'write the ' +'abstract'+ 'for it Giving heading as abstract for it'
#     inputs = {"messages": [HumanMessage(content=template +''.join(problem_statement)+qe+ert)]}
#     wd = connect.invoke(inputs)['messages'][-1].content

#     with open('fr1.txt','w') as f:
#         f.write(wd)
#     # f.close()
#     with open('fr1.txt','r') as f:
#         data = f.readlines()
#     # f.close()

#     for i in list1:
#         # ert = 'How to write a ' + i + ' in research papers give me the guidelines , what to mention , what not to mention in 4 lines'
#         # inputs = {"messages": [HumanMessage(content=ert)]}
#         # wd1 = app.invoke(inputs)['messages'][-1].content
#         #"Guidelines to write research paper "+wd1+"Above are the rules and guidelines follow this to generate the answer based on the user's problem statemetn and input "+
#         ert =  qe+'write the '+i+' for it'
#         inputs = {"messages": [HumanMessage(content=template +''.join(problem_statement)+ert)]}
#         wd = connect.invoke(inputs)['messages'][-1].content
#         wd = model.invoke(template2 +''.join(problem_statement)+'Here is the content you want to change based on above problem statement -'+ '\n'+wd)
            
#         with open('fr1.txt','a') as f:
#             f.write('\n\n'+i+'\n'+wd.content)
#     with open('fr1.txt', 'r') as f:
#         modified_content = f.read()
#     print("paper generated successfully:  Backend")
#     return jsonify({'modified_content': modified_content})

#     # f.close()
# if __name__ == '__main__':
#     app.run(port=5005,debug=True)
