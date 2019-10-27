from abc import ABC, abstractmethod
from Projects.EB.DataAccess.BaseDataObject import BaseDataObject as BaseDataObject
import Projects.EB.DataAccess.DataAdaptor as da
import pymysql


class RDBDataObject(BaseDataObject):


    @classmethod
    @abstractmethod
    def _get_table_info(cls):
        pass

    @classmethod
    @abstractmethod
    def get_table_name(cls):
        pass

    @classmethod
    def get_schema_info(cls):
        t_name = cls.get_table_name()
        q = "describe " + t_name
        res, data = da.run_q(q)
        return data

    @classmethod
    def get_primary_key_columns(cls):
        t_name = cls.get_table_name()
        q = 'show keys from ' + t_name + ' where key_name="PRIMARY" '
        res, d =  da.run_q(q)

        if d is not None and len(d) > 0:
            d = sorted(d, key=lambda i: i['Seq_in_index'])
            result = []

            for r in d:
                result.append(r['Column_name'])
        else:
            raise ValueError("Table does not have a primary key.")

        return result

    @classmethod
    def insert(cls, data):
        t_info = cls._get_table_info()
        t_name = t_info['table_name']
        q, args = da.create_insert(t_name, data)
        res, data = da.run_q(q,args)
        return res

    @classmethod
    def retrieve(cls, template, fields=None, limit=None, offset=None, orderby=None):
        t_name = cls.get_table_name()
        sql, args = da.create_select(t_name, template=template,
                                     fields=fields)
        res, d = da.run_q(sql, args=args, fetch=True)
        return d

    @classmethod
    def retrieve_by_key(cls, key_fields, fields):
        t_name = cls.get_table_name()
        kcs = cls.get_primary_key_columns()
        tmp = dict(zip(kcs, key_fields))
        sql, args = da.create_select(t_name, template=tmp,
                                     fields=fields)
        res, d = da.run_q(sql, args=args, fetch=True)
        return d
