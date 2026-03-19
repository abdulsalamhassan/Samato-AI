import csv

with open('backend/data/somalia_nomad_priority.csv', mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    data = list(reader)

for row in data:
    row['final_priority'] = float(row['final_priority'])
    row['population'] = int(row['population'])

data.sort(key=lambda x: x['final_priority'], reverse=True)

print("Top 10 Districts by Final Priority:")
for i, row in enumerate(data[:10]):
    print(f"{i+1}. {row['adm2_name']} ({row['adm1_name']}) - Pop: {row['population']}, Priority: {row['final_priority']}")
