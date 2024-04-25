# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import os

# app = Flask(__name__)

# CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"}})

# UPLOAD_FOLDER = 'uploads'
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'message': 'No file part in the request'}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'message': 'No file selected for uploading'}), 400
    
#     if file:
#         filename = file.filename
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#         file_url = f"http://localhost:5000/uploads/{filename}" 
#         return jsonify({'message': f'File {filename} received successfully', 'file_url': file_url}), 200

# @app.route('/uploads/<filename>', methods=['GET'])
# def download_file(filename):

#     response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     return response

# if __name__ == '__main__':
#     app.run(debug=True)
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os

# # Import research paper generation logic
# from langchain_openai import ChatOpenAI
# from langchain_community.tools.tavily_search import TavilySearchResults
# from langgraph.prebuilt import chat_agent_executor
# from langchain_core.messages import HumanMessage
# from langchain.utilities.tavily_search import TavilySearchAPIWrapper

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # Define upload folder
# UPLOAD_FOLDER = 'uploads'
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # Initialize research paper generation tools
# api_key = "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"
# search = TavilySearchAPIWrapper(tavily_api_key=api_key)
# tavily_tool = TavilySearchResults(api_wrapper=search)
# model = ChatOpenAI(model='gpt-3.5-turbo-1106', temperature=1, api_key="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")
# app_executor = chat_agent_executor.create_function_calling_executor(model, [tavily_tool])

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part in the request'}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No file selected for uploading'}), 400
    
#     if file:
#         filename = file.filename
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
#         # Read the uploaded file
#         with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'r') as fr:
#             problem_statement = fr.read()

#         # Generate research paper based on the problem statement
#         inputs = {"messages": [HumanMessage(content=problem_statement)]}
#         result = app_executor.invoke(inputs)
#         research_paper = result['messages'][-1].content

#         return jsonify({'message': 'Research paper generated successfully', 'research_paper': research_paper}), 200

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import research paper generation logic
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import chat_agent_executor
from langchain_core.messages import HumanMessage
from langchain.utilities.tavily_search import TavilySearchAPIWrapper

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize research paper generation tools
api_key = "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"
search = TavilySearchAPIWrapper(tavily_api_key=api_key)
tavily_tool = TavilySearchResults(api_wrapper=search)
model = ChatOpenAI(model='gpt-3.5-turbo-1106', temperature=1, api_key="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")
app_executor = chat_agent_executor.create_function_calling_executor(model, [tavily_tool])

def generate_research_paper(problem_statement):
    # Generate research paper based on the problem statement
    inputs = {"messages": [HumanMessage(content=problem_statement)]}
    result = app_executor.invoke(inputs)
    research_paper = result['messages'][-1].content
    return research_paper

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    
    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Read the uploaded file
        with open(file_path, 'r') as fr:
            problem_statement = fr.read()

        # Generate research paper based on the problem statement
        research_paper = generate_research_paper(problem_statement)

        return jsonify({'message': 'Research paper generated successfully', 'research_paper': research_paper}), 200

if __name__ == '__main__':
    app.run(debug=True)
