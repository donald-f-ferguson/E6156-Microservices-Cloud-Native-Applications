import Projects.EB.Middleware.security as security
from Projects.EB.Context.Context import Context
from Projects.EB.Services.CustomerInfo.Users import UsersService as user_svc



class RegisterLoginSvc():

    _context = None

    @classmethod
    def set_context(cls, ctx):
        RegisterLoginSvc._context = ctx

    @classmethod
    def get_data_object(cls):
        return None

    @classmethod
    def get_context(cls):
        if cls._context is None:
            cls.set_context(Context.get_default_context())
        return cls._context


    @classmethod
    def register(cls, data):

        hashed_pw = security.hash_password({"password" : data['password']})
        data["password"] = hashed_pw
        result = user_svc.create_user(data)
        s_info = user_svc.get_by_email(data['email'])
        tok = security.generate_token(s_info)
        return result, tok

    @classmethod
    def login(cls, login_info):
        test = security.hash_password({"password" : login_info['password']})
        s_info = user_svc.get_by_email(login_info['email'])
        test = str(test)
        if str(test) == s_info['password']:
            tok = security.generate_token(s_info)
            return tok
        else:
            return False

    @classmethod
    def get_field_map(cls, target_resource):
        pass






