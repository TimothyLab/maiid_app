import hashlib

def calculate_md5(file_content):
    """Calcule l'empreinte MD5 d'un contenu binaire."""
    hash_md5 = hashlib.md5()
    hash_md5.update(file_content)
    return hash_md5.hexdigest()
