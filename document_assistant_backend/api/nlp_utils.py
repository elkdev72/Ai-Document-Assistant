# api/nlp_utils.py
import spacy
import language_tool_python

# Initialize the spaCy model and LanguageTool
nlp = spacy.load("en_core_web_sm")
tool = language_tool_python.LanguageTool('en-US')
