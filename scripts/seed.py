"""Seed demo data into OceanBase for FormBuddy hackathon demo."""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from core.database import engine, Base, SessionLocal
from models.transaction import FormTemplate
from models.user import User
from models.alert import VoiceSession

USERS = [
    {"name": "Ahmad Razak", "phone": "+60121234567", "preferred_language": "ms"},
    {"name": "Siti Nurhaliza", "phone": "+60129876543", "preferred_language": "ms"},
    {"name": "Raj Kumar", "phone": "+60131112222", "preferred_language": "ta"},
    {"name": "Mei Ling Tan", "phone": "+60143334444", "preferred_language": "zh"},
    {"name": "John Smith", "phone": "+60155556666", "preferred_language": "en"},
]

FORM_TEMPLATES = [
    {
        "name": "Bank Account Opening",
        "category": "banking",
        "language": "en",
        "fields": [
            {"name": "full_name", "label": "Full Name", "type": "text", "required": True},
            {"name": "ic_number", "label": "IC Number", "type": "text", "required": True},
            {"name": "phone", "label": "Phone Number", "type": "phone", "required": True},
            {"name": "email", "label": "Email Address", "type": "email", "required": False},
            {"name": "address", "label": "Home Address", "type": "text", "required": True},
            {"name": "account_type", "label": "Account Type", "type": "select", "required": True, "options": ["savings", "current", "fixed_deposit"]},
        ],
    },
    {
        "name": "Pembukaan Akaun Bank",
        "category": "banking",
        "language": "ms",
        "fields": [
            {"name": "nama_penuh", "label": "Nama Penuh", "type": "text", "required": True},
            {"name": "no_ic", "label": "Nombor IC", "type": "text", "required": True},
            {"name": "telefon", "label": "Nombor Telefon", "type": "phone", "required": True},
            {"name": "emel", "label": "Alamat Emel", "type": "email", "required": False},
            {"name": "alamat", "label": "Alamat Rumah", "type": "text", "required": True},
            {"name": "jenis_akaun", "label": "Jenis Akaun", "type": "select", "required": True, "options": ["simpanan", "semasa", "deposit_tetap"]},
        ],
    },
    {
        "name": "Insurance Claim",
        "category": "insurance",
        "language": "en",
        "fields": [
            {"name": "policy_number", "label": "Policy Number", "type": "text", "required": True},
            {"name": "claimant_name", "label": "Claimant Name", "type": "text", "required": True},
            {"name": "incident_date", "label": "Date of Incident", "type": "date", "required": True},
            {"name": "description", "label": "Incident Description", "type": "text", "required": True},
            {"name": "claim_amount", "label": "Claim Amount (RM)", "type": "number", "required": True},
        ],
    },
    {
        "name": "银行开户申请",
        "category": "banking",
        "language": "zh",
        "fields": [
            {"name": "full_name", "label": "全名", "type": "text", "required": True},
            {"name": "ic_number", "label": "身份证号码", "type": "text", "required": True},
            {"name": "phone", "label": "电话号码", "type": "phone", "required": True},
            {"name": "address", "label": "住址", "type": "text", "required": True},
        ],
    },
    {
        "name": "வங்கி கணக்கு திறப்பு",
        "category": "banking",
        "language": "ta",
        "fields": [
            {"name": "full_name", "label": "முழு பெயர்", "type": "text", "required": True},
            {"name": "ic_number", "label": "அடையாள அட்டை எண்", "type": "text", "required": True},
            {"name": "phone", "label": "தொலைபேசி எண்", "type": "phone", "required": True},
            {"name": "address", "label": "வீட்டு முகவரி", "type": "text", "required": True},
        ],
    },
    {
        "name": "Fund Transfer",
        "category": "transfer",
        "language": "en",
        "fields": [
            {"name": "recipient", "label": "Recipient Name", "type": "text", "required": True},
            {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
            {"name": "reference", "label": "Reference", "type": "text", "required": False},
        ],
    },
    {
        "name": "Pindahan Wang",
        "category": "transfer",
        "language": "ms",
        "fields": [
            {"name": "penerima", "label": "Nama Penerima", "type": "text", "required": True},
            {"name": "jumlah", "label": "Jumlah (RM)", "type": "number", "required": True},
            {"name": "rujukan", "label": "Rujukan", "type": "text", "required": False},
        ],
    },
    {
        "name": "Bill Payment",
        "category": "payment",
        "language": "en",
        "fields": [
            {"name": "biller", "label": "Biller Name", "type": "text", "required": True},
            {"name": "account_no", "label": "Account Number", "type": "text", "required": True},
            {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
        ],
    },
    {
        "name": "Prepaid Reload",
        "category": "reload",
        "language": "en",
        "fields": [
            {"name": "phone_number", "label": "Phone Number", "type": "phone", "required": True},
            {"name": "amount", "label": "Amount (RM)", "type": "number", "required": True},
            {"name": "carrier", "label": "Carrier", "type": "select", "required": True, "options": ["Maxis", "Celcom", "Digi", "U Mobile", "Yes"]},
        ],
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing
    db.query(VoiceSession).delete()
    db.query(FormTemplate).delete()
    db.query(User).delete()
    db.commit()

    # Seed users
    users = []
    for u in USERS:
        user = User(**u)
        db.add(user)
        users.append(user)
    db.commit()

    # Seed form templates
    forms = []
    for t in FORM_TEMPLATES:
        form = FormTemplate(
            name=t["name"],
            fields=json.dumps(t["fields"]),
            language=t["language"],
            category=t["category"],
        )
        db.add(form)
        forms.append(form)
    db.commit()

    # Seed a couple of completed demo sessions
    demo_sessions = [
        {
            "user_id": users[0].id,
            "form_template_id": forms[1].id,  # Malay bank form
            "language": "ms",
            "status": "completed",
            "filled_data": json.dumps({
                "nama_penuh": "Ahmad bin Razak",
                "no_ic": "900101-14-5678",
                "telefon": "+60121234567",
                "alamat": "No 12, Jalan Merdeka, KL",
                "jenis_akaun": "simpanan",
            }),
        },
        {
            "user_id": users[4].id,
            "form_template_id": forms[0].id,  # English bank form
            "language": "en",
            "status": "completed",
            "filled_data": json.dumps({
                "full_name": "John Smith",
                "ic_number": "850515-10-1234",
                "phone": "+60155556666",
                "email": "john@example.com",
                "address": "45 Jalan Ampang, KL",
                "account_type": "savings",
            }),
        },
        {
            "user_id": users[1].id,
            "form_template_id": forms[0].id,
            "language": "ms",
            "status": "completed",
            "filled_data": json.dumps({"nama_penuh": "Siti Nurhaliza", "no_ic": "850303-14-5522", "telefon": "+60129876543", "alamat": "Jalan Bukit Bintang, KL", "jenis_akaun": "semasa"}),
        },
        {
            "user_id": users[2].id,
            "form_template_id": forms[2].id,
            "language": "en",
            "status": "completed",
            "filled_data": json.dumps({"policy_number": "POL-2026-001", "claimant_name": "Raj Kumar", "incident_date": "2026-04-20", "description": "Water damage to shop", "claim_amount": 5000}),
        },
        {
            "user_id": users[3].id,
            "form_template_id": forms[3].id,
            "language": "zh",
            "status": "completed",
            "filled_data": json.dumps({"full_name": "陈美玲", "ic_number": "920515-10-8844", "phone": "+60143334444", "address": "Jalan Imbi, KL"}),
        },
        {
            "user_id": users[0].id,
            "form_template_id": forms[0].id,
            "language": "en",
            "status": "active",
            "filled_data": json.dumps({"full_name": "Ahmad Razak", "ic_number": "900101-14-5678"}),
        },
        {
            "user_id": users[1].id,
            "form_template_id": forms[2].id,
            "language": "en",
            "status": "completed",
            "filled_data": json.dumps({"policy_number": "POL-2026-002", "claimant_name": "Siti Nurhaliza", "incident_date": "2026-04-22", "description": "Motorcycle accident", "claim_amount": 3500}),
        },
        {
            "user_id": users[4].id,
            "form_template_id": forms[0].id,
            "language": "en",
            "status": "completed",
            "filled_data": json.dumps({"full_name": "John Smith", "ic_number": "850515-10-1234", "phone": "+60155556666", "email": "john@example.com", "address": "45 Jalan Ampang, KL", "account_type": "savings"}),
        },
        {
            "user_id": users[2].id,
            "form_template_id": forms[4].id,
            "language": "ta",
            "status": "completed",
            "filled_data": json.dumps({"full_name": "ராஜ் குமார்", "ic_number": "880707-08-3344", "phone": "+60131112222", "address": "Brickfields, KL"}),
        },
        {
            "user_id": users[0].id,
            "form_template_id": forms[1].id,
            "language": "ms",
            "status": "active",
            "filled_data": json.dumps({"nama_penuh": "Ahmad bin Razak", "no_ic": "900101-14-5678"}),
        },
    ]
    for s in demo_sessions:
        db.add(VoiceSession(**s))
    db.commit()

    print(f"Seeded: {len(users)} users, {len(forms)} form templates, {len(demo_sessions)} demo sessions")
    db.close()


if __name__ == "__main__":
    seed()
