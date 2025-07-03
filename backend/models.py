from __future__ import annotations
import sqlite3
from typing import Optional, Dict, Any, List
import os
from pydantic import BaseModel, EmailStr, Json, validator
from datetime import datetime

DATABASE_FILE = "db.sqlite3"


def init_db():
    if not os.path.exists(DATABASE_FILE):
        with sqlite3.connect(DATABASE_FILE) as conn:
            with open("schema.sql") as f:
                conn.executescript(f.read())


def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = lambda cursor, row: {
        col[0]: row[idx] for idx, col in enumerate(cursor.description)
    }
    return conn


def query_db(query, kwargs={}) -> Optional[Dict[str, Any] | int]:
    conn = get_db_connection()
    cursor = conn.execute(query, kwargs)
    conn.commit()

    result = None
    match first_word := query.strip().upper().split(' ')[0]:
        case 'SELECT' | 'PRAGMA': 
            result = cursor.fetchall()
        case 'INSERT' | 'UPDATE': 
            result = cursor.lastrowid
        case _: 
            raise Exception(f"Define how to handle this query: {query}")

    conn.close()
    return result


states = {
    "names": [
        "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
        "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois",
        "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
        "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana",
        "Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
        "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
        "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
        "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
    ],
    "abbreviations": [
        "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA",
        "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO",
        "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK",
        "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI",
        "WV", "WY", "DC", "AS", "GU", "MP", "PR", "VI",
    ]
}

class User(BaseModel):
    id: int
    email_address: Optional[EmailStr]
    password: Optional[str]
    birthdate: Optional[str]
    address: Optional[Json]
    about_me: Optional[str]

    @validator("password")
    def validate_password(cls, value: Optional[str]):
        if value:
            # confirm no unnecessary leading/trailing spaces
            if value != value.strip():
                raise ValueError(
                    f"invalid leading/trailing spaces in "
                    f"password: {repr(value)}"
                )
        return value


    @validator("birthdate")
    def validate_birthdate(cls, value: Optional[str]):
        if value:
            # confirm age is in valid range
            min_age = 0
            world_record_age = 122
            birthdate = datetime.strptime(value, "%Y-%m-%d")
            age = (datetime.now() - birthdate).days / 365
            if not (min_age < age < world_record_age):
                raise ValueError(
                    f"invalid age of {age} years, "
                    f"should be between {min_age} and {world_record_age}"
                )
        return value

    @validator("address")
    def validate_address(cls, value: Optional[Dict[str, str]]):
        if value and not all(v=='' for k, v in value.items()):
            # confirm address is made up of valid fields
            expected_fields = {"street", "city", "state", "zip"}
            actual_fields = set(value.keys())
            if actual_fields != expected_fields:
                raise ValueError(
                    f"Expected address fields {', '.join(expected_fields)}, "
                    f"got {', '.join(actual_fields)}"
                )
            # confirm no unnecessary leading/trailing spaces
            for field in expected_fields:
                if value[field] != value[field].strip():
                    raise ValueError(
                        f"invalid leading/trailing spaces in "
                        f"{repr(field)} field of address: {repr(value[field])}"
                    )
            # confirm valid state name or abbreviation
            if (
                (state := value["state"]) and 
                not state in (
                    states["names"] + states["abbreviations"]
                )
            ):
                raise ValueError(f"invalid state name/abbr: {repr(state)}")
        return value

    @classmethod
    def get_database_fields(cls) -> List[str]:
        return [
            field for field in cls.model_json_schema()['properties'].keys()
            if field != 'id'
        ]

    @classmethod
    def create(cls):
        return query_db('''
            INSERT INTO users 
                (email_address, password) 
            VALUES 
                ('','')
        ''')

    @classmethod
    def get(cls, user_id: int) -> Optional[User]:
        rows = query_db("SELECT * FROM users WHERE id = :id", {"id": user_id})
        if rows:
            return User(**rows[0])

    @classmethod
    def update(cls, user_id: int, updates: dict):
        for field, value in updates.items():
            query_db(
                f"UPDATE users SET {field} = :value WHERE id = :id", 
                {"id": user_id, "value": value}
            )


