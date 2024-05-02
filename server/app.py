# from langchain_openai import ChatOpenAI
# from langchain_community.tools.tavily_search import TavilySearchResults
# from langgraph.prebuilt import chat_agent_executor
# from langchain_core.messages import HumanMessage
# from langchain.utilities.tavily_search import TavilySearchAPIWrapper
# from fpdf import FPDF

# from flask import Flask, request, jsonify
# from flask_cors import CORS

# api_key = "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"

# search = TavilySearchAPIWrapper(tavily_api_key=api_key)
# tavily_tool = TavilySearchResults(api_wrapper=search)

# tools = [tavily_tool]

# model = ChatOpenAI(model='gpt-3.5-turbo-1106',temperature=1,api_key="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")
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

#     Here is the problem statement - Dont mention title .

#     """

#     qe = """Based on the user's input you should write the research paper . If you want to leave a place for images or anything  just say 
#             Here is the User's question - """

#     list1 = ['Abstract','Introduction','Related Works','Software System Design','System Architecture','Software Implementation','Software Technologies','Conclusion']
#     # list1 = ['Abstract']
#     ert = 'write the ' +'title'
#     template3 = 'Generate the title for the problem statement in one line. title should be short dont mention programming languages in it'
#     inputs = {"messages": [HumanMessage(content=template3 +''.join(problem_statement)+ qe + ert)]}
#     wd = model.invoke(template3 +''.join(problem_statement)+ qe + ert).content

#     pdf = FPDF()
#     pdf.add_page()
#     pdf.set_margins(left=20, right=20, top=20)

#     # pdf.set_font('Arial', 'B', 12)
#     # pdf.cell(0, 10, wd, align='C')
#     # pdf.ln(20)

#     # Abstract
#     # pdf.set_font('Arial', 'B', 14)
#     # pdf.cell(0, 10, 'Abstract')
#     # pdf.ln(10,align='C')

#     pdf.set_font('Arial', 'B', 12)
#     # pdf.cell(0, 10, wd, align='C')
#     split_text = wd.split('\n')
#     for line in split_text:
#         pdf.multi_cell(0, 5, line,align='C')
#     pdf.ln(10)


#     with open('fr1.txt','w') as f:
#         f.write(wd)
#     # f.close()

#     # with open('fr1.txt','r') as f:
#     #     data = f.readlines()
#     # f.close()

#     for i in list1:
#         ert =  qe+'write the '+i+' for it'
#         inputs = {"messages": [HumanMessage(content=template +''.join(problem_statement)+ert)]}
#         wd = connect.invoke(inputs)['messages'][-1].content
#         wd = model.invoke(template2 +''.join(problem_statement)+'Here is the content you want to change based on above problem statement -'+ '\n'+wd).content
        
#         pdf.set_font('Arial', 'B', 14)
#         pdf.cell(0, 10, i.capitalize())
#         pdf.ln(10)
#         pdf.set_font('Arial', '', 12)
#         split_text = wd.split('\n')
#         for line in split_text:
#             pdf.multi_cell(0, 5, line)
#         pdf.ln(10)

#         with open('fr1.txt','a') as f:
#             f.write('\n'+i+'\n'+wd)
#     with open('fr1.txt', 'r') as f:
#         modified_content = f.read()

#     print("paper generated successfully:  Backend")
#     pdf.output('research_paper.pdf')
#     print("Research paper generated successfully: Backend")
#     return jsonify({'modified_content': modified_content})
#     # f.close()

# if __name__ == '__main__':
#     app.run(port=5002,debug=True)

import json
from langchain_openai import ChatOpenAI
from typing import List
from langchain.tools import tool
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama
from Templates import *
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

class WriterAgent():
    def __init__(self,data):
        self.llm =  ChatOpenAI(model='gpt-3.5-turbo-1106',temperature=1,api_key="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")
        self.data = data
    def FileWriter(self,content):
        with open('ResearchPaper.txt','a') as f:
            for text in content:
                f.write("\n"+text+"\n")
        f.close()
        print('--- File Saved Successfully ---')
    @tool
    def output_parser(headings:List[str]):
        """ Save the headings or titles - use this tool"""
        return {'headings' :headings }
    
    def Templates(self):
        self.HeadingGeneratorPrompt = PromptTemplate(template=Heading_Generator_Template,  
                                                        input_variables=["project_details"],)
        self.ResearchAgentPrompt = PromptTemplate(template=Research_Agent_Template, 
                                                        input_variables=["project_details",'question'],)
    def HeadingGenerator(self):
        llm2 =  self.llm.bind_tools([WriterAgent.output_parser])
        chain2 = self.HeadingGeneratorPrompt  | self.llm
        sol1 = chain2.invoke({'project_details':self.data})
        sol2 = llm2.invoke(sol1.content)
        sol3 = json.loads(sol2.additional_kwargs['tool_calls'][0]['function']['arguments'])
        print('Titles generated - ',sol3['headings'])
        return sol3['headings']
        
    def ResearchAgent(self,heading):
        question = f"Write the {heading} for the research paper Use the problem statement for details. Important thing is First give heading then content. before heading don't mention title: , heading: .  Mention '\n'. And provide the output in paragraph. Another part If you are writing one section don't mention other things like references,advantages,disadvantages,other things.   "
        chain = self.ResearchAgentPrompt | self.llm
        sol = chain.invoke({'project_details':self.data,'question':question})
        return sol.content
    def TitleGenerator(self):
        problem_statement_str = ' '.join(self.data)
        sol = self.llm.invoke(problem_statement_str+" Based on above description generate the title for the research paper and dont give output like title: , heading: , content:.  Just output the generated title").content
        return sol

    def MethodCalling(self):
        ContentList = []
        WriterAgent.Templates(self)
        titles = WriterAgent.HeadingGenerator(self)
        Title = WriterAgent.TitleGenerator(self)
        ContentList.append(Title)
        # titles=['Abstract']
        for i in titles:
            content = WriterAgent.ResearchAgent(self,heading = i)
            ContentList.append(content)
        WriterAgent.FileWriter(self,ContentList)
        print('--- Successfully written ---')
        return ContentList

@app.route('/process_file', methods=['POST'])
def process_file():
    file = request.files['file']
    file_content = file.read().decode('utf-8')
    problem_statement = [file_content]
    agent = WriterAgent(problem_statement)
    ContentList = agent.MethodCalling()
    # print("Content List",ContentList)

    with open('ResearchPaper.txt','r') as f:
        ContentList = f.read()

    return jsonify({'ContentList': ContentList})
    # return jsonify({'ContentList': ContentList, 'generated_content': ContentList[-1]})


if __name__ == '__main__':
    app.run(port=5002,debug=True)