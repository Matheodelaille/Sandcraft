import os

img_folder = r"E:\Sandcraft\wiki\images"
recettes_folder = r"E:\Sandcraft\wiki\recettes"
output_home = r"E:\Sandcraft\wiki\README.md"

mod_icons = {}
for img in sorted(os.listdir(img_folder)):
    mod = img.split('_')[0]
    if mod not in mod_icons:
        mod_icons[mod] = img

with open(output_home, 'w', encoding='utf-8') as f:
    f.write("# 🌐 Sandcraft - Encyclopédie des Mods\n\n")
    f.write("Cliquez sur le nom d'un mod pour explorer ses recettes de craft.\n\n")
    f.write("| Icône | Nom du Mod | Lien Direct |\n")
    f.write("| :---: | :--- | :--- |\n")
    
    mods = [m.replace('.md', '') for m in os.listdir(recettes_folder) if m.endswith('.md')]
    mods.sort()
    
    for mod in mods:
        icon = mod_icons.get(mod, "")
        display_name = mod.replace('_', ' ').title()
        # On ajoute width='32' pour harmoniser la taille
        icon_html = f"<img src='./images/{icon}' width='32' />" if icon else "📦"
        f_path = f"./recettes/{mod}.md"
        f.write(f"| {icon_html} | **{display_name}** | [Ouvrir la fiche]({f_path}) |\n")

print("Sommaire harmonisé généré !")