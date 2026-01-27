import json
import io


replace = {
    'mahoutsukai.weaponprojectile': 'mahoutsukai.weaponprojectiles',
           }

def langToJson(inf, outf):
    fin = open(inf, "rt")
    data = fin.read()
    for r in replace:    
        data = data.replace(r, replace[r])
    fin.close()
    fin = open(outf, "wt")
    fin.write(data)
    fin.close()

langToJson("en_us.lang", "en_us.lang") 
langToJson("zh_cn.lang", "zh_cn.lang")
langToJson("hu_hu.lang", "hu_hu.lang")
langToJson("de_de.lang", "de_de.lang")
langToJson("la_va.lang", "la_va.lang")
langToJson("ru_ru.lang", "ru_ru.lang") 
langToJson("uk_ua.lang", "uk_ua.lang") 
langToJson("ja_jp.lang", "ja_jp.lang") 
langToJson("fr_fr.lang", "fr_fr.lang") 
langToJson("pt_br.lang", "pt_br.lang") 
langToJson("pt_pt.lang", "pt_pt.lang") 
langToJson("es_cl.lang", "es_cl.lang") 
langToJson("es_ar.lang", "es_ar.lang") 
langToJson("es_es.lang", "es_es.lang") 
langToJson("es_mx.lang", "es_mx.lang") 
langToJson("es_uy.lang", "es_uy.lang") 
langToJson("es_ve.lang", "es_ve.lang") 
langToJson("ko_kr.lang", "ko_kr.lang") 
