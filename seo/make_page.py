import sys,json
tpl=open(sys.argv[1],encoding="utf-8").read(); data=open(sys.argv[2],encoding="utf-8").read()
seed=json.dumps(json.loads(data),ensure_ascii=False).replace("</","<\\/")
open(sys.argv[3],"w",encoding="utf-8").write(tpl.replace("__SEED__",seed)); print("page ok")
