import re
import json
from collections import defaultdict

def sql_to_json(sql_file_path, json_file_path):
    # Dictionnaire pour stocker les données par table
    database = defaultdict(list)
    
    # Expressions régulières pour extraire les données INSERT
    insert_pattern = re.compile(
        r'INSERT\s+INTO\s+`?(\w+)`?\s+VALUES\s*\((.*?)\);',
        re.IGNORECASE | re.MULTILINE | re.DOTALL
    )
    
    # Lire le fichier SQL
    with open(sql_file_path, 'r', encoding='utf-8') as sql_file:
        sql_content = sql_file.read()
    
    # Trouver toutes les instructions INSERT
    for match in insert_pattern.finditer(sql_content):
        table_name = match.group(1)
        values_str = match.group(2)
        
        # Nettoyer et diviser les lignes de valeurs
        value_lines = [line.strip() for line in values_str.split('\n') if line.strip()]
        
        for line in value_lines:
            # Enlever les parenthèses et diviser les valeurs
            if line.startswith('(') and line.endswith(')'):
                line = line[1:-1]
            
            # Séparer les valeurs en tenant compte des chaînes avec virgules
            values = []
            current = ''
            in_quotes = False
            for char in line:
                if char == "'" and not in_quotes:
                    in_quotes = True
                elif char == "'" and in_quotes:
                    in_quotes = False
                
                if char == ',' and not in_quotes:
                    values.append(current.strip())
                    current = ''
                else:
                    current += char
            
            if current:
                values.append(current.strip())
            
            # Nettoyer les valeurs
            cleaned_values = []
            for val in values:
                if val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                elif val == 'NULL':
                    val = None
                else:
                    try:
                        val = float(val) if '.' in val else int(val)
                    except ValueError:
                        pass
                cleaned_values.append(val)
            
            # Ajouter à la table correspondante
            database[table_name].append(cleaned_values)
    
    # Écrire le JSON
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(database, json_file, indent=2, ensure_ascii=False)

# Exemple d'utilisation
sql_to_json('export.sql', 'export.json')

import json

def clean_value(value):
    if isinstance(value, str):
        # Nettoyer les chaînes de caractères
        value = value.strip()
        
        # Supprimer les parenthèses et apostrophes superflues
        if value.startswith("('") and value.endswith("')"):
            value = value[2:-2]
        elif value.startswith("('"):
            value = value[2:]
        elif value.endswith("')"):
            value = value[:-2]
        elif value.startswith("("):
            value = value[1:]
        elif value.endswith(")"):
            value = value[:-1]
        
        # Supprimer les apostrophes simples restantes
        if value.startswith("'") and value.endswith("'"):
            value = value[1:-1]
        
        # Gérer les valeurs NULL
        if value.upper() == 'NULL':
            return None
        
        # Convertir les nombres
        if value.isdigit():
            return int(value)
        try:
            return float(value)
        except ValueError:
            pass
    
    return value

def clean_and_format_json(input_json_path, output_json_path):
    # Schéma complet des tables avec leurs colonnes
    tables_schema = {
        "ANALYSE": [
            "id_analyse",
            "date_analyse",
            "algo_config",
            "user_feedback",
            "created_at",
            "id_user",
            "id_image"
        ],
        "BOUNDING_BOX": [
            "id_bounding_box",
            "x1",
            "y1",
            "x2",
            "y2",
            "class_result",
            "id_image"
        ],
        "GROUPE": [
            "id_groupe",
            "nom_groupe"
        ],
        "IMAGE": [
            "id_image",
            "md5_hash",
            "image_path"
        ],
        "UTILISATEUR": [
            "id_user",
            "login",
            "password",
            "nom",
            "prenom",
            "email",
            "date_inscription",
            "id_groupe"
        ]
    }

    # Charger le JSON existant
    with open(input_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cleaned_data = {}

    for table_name, rows in data.items():
        cleaned_rows = []
        
        # Vérifier si la table est dans notre schéma
        if table_name not in tables_schema:
            print(f"Attention: Table {table_name} non reconnue, traitement générique")
            cleaned_data[table_name] = rows
            continue
        
        columns = tables_schema[table_name]
        
        for row in rows:
            # Nettoyer chaque valeur du tableau
            cleaned_values = []
            for value in row:
                cleaned_values.append(clean_value(value))
            
            # Créer un dictionnaire avec les noms de colonnes
            row_dict = {}
            for i, col_name in enumerate(columns):
                if i < len(cleaned_values):
                    row_dict[col_name] = cleaned_values[i]
                else:
                    row_dict[col_name] = None
            
            cleaned_rows.append(row_dict)
        
        cleaned_data[table_name] = cleaned_rows

    # Sauvegarder le JSON nettoyé
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

# Exemple d'utilisation
clean_and_format_json('export.json', 'export_clean.json')



def get_data_from_json(file_path: str):
    with open(file_path, 'r') as file:  
        data = json.load(file)
    return data

print(get_data_from_json('export_clean.json'))