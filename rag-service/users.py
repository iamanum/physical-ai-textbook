# rag-service/users.py

from pydantic import BaseModel
from typing import Dict

# Comment: UserModel ko string quotes mein daalein taake forward reference theek ho jaye
USER_DB: Dict[str, 'UserModel'] = {}

class UserModel(BaseModel):
    # Bonus requirement: user background store karna
    username: str
    software_background: str = "Beginner" # Options: Beginner, ROS_Familiar, Expert_Python
    hardware_background: str = "Laptop"   # Options: Laptop, RTX_GPU, Jetson_Orin
    is_authenticated: bool = False

class AuthRequest(BaseModel):
    username: str
    password: str
    
def get_user(username: str):
    return USER_DB.get(username)

def signup_user(request: AuthRequest, software: str, hardware: str):
    if request.username in USER_DB:
        return {"success": False, "message": "User already exists"}
    
    # Comment: Naya user create karein
    new_user = UserModel(
        username=request.username,
        software_background=software,
        hardware_background=hardware,
        is_authenticated=True
    )
    USER_DB[request.username] = new_user
    return {"success": True, "message": "Signup successful", "user": new_user}

def signin_user(request: AuthRequest):
    user = get_user(request.username)
    if user and request.password == "hackathon2025": # Simple password check
        user.is_authenticated = True
        return {"success": True, "message": "Signin successful", "user": user}
    return {"success": False, "message": "Invalid credentials"}