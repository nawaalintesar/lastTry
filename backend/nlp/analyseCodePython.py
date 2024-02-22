import ast
import json
import sys

def parseCode(code):
    classes = []
    relationships = []

    def get_class_lines(class_node):
        start_line, end_line = class_node.lineno, class_node.end_lineno
        return f"[{start_line} - {end_line}]"

    for node in ast.walk(ast.parse(code)):
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                function_name = node.func.attr
                lines_of_code = f"[{node.lineno} - {node.end_lineno}]"
                
                # Check if there's an existing relationship for the same target function
                existing_relationship = next((rel for rel in relationships if rel['target']['name'] == function_name), None)
                
                if existing_relationship:
                    # If there's an existing relationship, merge the lines of code
                    existing_relationship['linesOfCode'] += f", {lines_of_code}"
                else:
                    # Otherwise, add a new relationship
                    relationships.append({
                        'type': 'method overloading',
                        'source': {'type': 'class', 'name': node.func.value.id},
                        'target': {'type': 'function', 'name': function_name},
                        'linesOfCode': lines_of_code,
                    })


        if isinstance(node, ast.ClassDef):
            class_info = {
                'isClass': True,
                'name': node.name,
                'attributes': [],
                'methods': [],
                'linesOfCode': get_class_lines(node),
            }

            for class_node in node.body:
                if isinstance(class_node, ast.FunctionDef):
                    if class_node.name == '_init_':
                        for i in range(1, len(class_node.args.args)):
                            attribute_name = class_node.args.args[i].arg
                            attribute_type = ''
                            class_info['attributes'].append({
                                'name': class_node.args.args[i].arg,
                                'type': attribute_type,
                            })

                    method_info = {
                        'name': class_node.name,
                        'returnType': '',
                        'parameters': [{'name': arg.arg, 'type': ''} for arg in class_node.args.args],
                    }
                    if class_node.returns:
                        method_info['returnType'] = ast.get_source_segment(code, class_node.returns).strip()
# Assuming parent class is the first base class in the bases list
                    parent_class_name = node.bases[0].id if node.bases else None

                    # Check for method overriding against the parent class only
                    if parent_class_name:
                        for base_class_info in classes:
                            if base_class_info['name'] == parent_class_name:
                                for base_method in base_class_info['methods']:
                                    if method_info['name'] == base_method['name'] and method_info['parameters'] == base_method['parameters']:
                                        relationships.append({
                                            'type': 'method overriding',
                                            'source': {'type': 'function', 'name': f"{base_class_info['name']}.{base_method['name']}"},
                                            'target': {'type': 'function', 'name': f"{class_info['name']}.{method_info['name']}"},
                                            'linesOfCode': get_class_lines(class_node),
                                        })
                                        relationships.append({
                                            'type': 'polymorphism',
                                            'source': {'type': 'class', 'name': f"{base_class_info['name']}.{base_method['name']}"},
                                            'target': {'type': 'class', 'name': f"{class_info['name']}.{method_info['name']}"},
                                            'linesOfCode': get_class_lines(class_node),
                                        })


                    class_info['methods'].append(method_info)


            classes.append(class_info)

            for base_class in node.bases:
                relationships.append({
                    'type': 'inheritance',
                    'source': {'type': 'class', 'name': node.name},
                    'target': {'type': 'class', 'name': base_class.id if base_class.id else None},
                    'linesOfCode': get_class_lines(node),
                })

            for class_node in node.body:
                if isinstance(class_node, ast.FunctionDef):
                    if class_node.name == '_init_':
                        relationships.append({
                            'type': 'encapsulation',
                            'source': {'type': 'class', 'name': node.name},
                            'target': {'type': 'class', 'name': None},
                            'linesOfCode': get_class_lines(class_node),
                        })

                    elif class_node.name.startswith('_'):
                        relationships.append({
                            'type': 'encapsulation',
                            'source': {'type': 'class', 'name': node.name},
                            'target': {'type': 'class', 'name': None},
                            'linesOfCode': get_class_lines(class_node),
                        })

                    if class_node.decorator_list:
                        for decorator in class_node.decorator_list:
                            if isinstance(decorator, ast.Name) and decorator.id == 'abstractmethod':
                                relationships.append({
                                    'type': 'abstract class',
                                    'source': {'type': 'class', 'name': node.name},
                                    'target': {'type': 'class', 'name': None},
                                    'linesOfCode': get_class_lines(class_node),
                                })

    return classes, relationships

# Read the code from the command line arguments
if len(sys.argv) != 2:
    print("Usage: python analyseCodePython.py <code>")
    sys.exit(1)

code_to_analyze = sys.argv[1]

# Call the parseCode function with the provided code
results = parseCode(code_to_analyze)

# Construct JSON object
json_object = {
    'classes': results[0],
    'relationships': results[1],
}

# Convert the JSON object to a string and print it
json_string = json.dumps(json_object, indent=2)
print(json_string)