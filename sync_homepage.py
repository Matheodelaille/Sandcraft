import os

wiki_readme = r"E:\Sandcraft\wiki\README.md"
root_readme = r"E:\Sandcraft\README.md"

if not os.path.exists(wiki_readme):
    print("Erreur : Le README du wiki est introuvable.")
else:
    with open(wiki_readme, 'r', encoding='utf-8') as f:
        content = f.read()

    # Adaptation des chemins pour la racine
    new_content = content.replace("(./images/", "(./wiki/images/")
    new_content = new_content.replace("(./recettes/", "(./wiki/recettes/")
    new_content = new_content.replace("src='./images/", "src='./wiki/images/")

    with open(root_readme, 'w', encoding='utf-8') as f:
        f.write("# 🏰 Bienvenue sur le Wiki Sandcraft\n\n")
        f.write("> [!TIP]\n")
        f.write("> Utilisez la barre de recherche GitHub en haut à gauche pour trouver un item précis.\n\n")
        f.write(new_content)

    print("Synchro terminée ! Fais ton Push final sur GitHub.")