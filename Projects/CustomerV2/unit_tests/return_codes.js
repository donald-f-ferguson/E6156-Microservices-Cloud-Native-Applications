/**
 * Created by donaldferguson on 8/26/18.
 */

exports.codes = {
    success: {code: 0, message: "Cool."},
    registration_success: { code: 1, message: "Registration succeeded."},
    login_success: { code: 2, message: "Login success."},
    invalid_query: {code: -1, message: "Template is not cool!"},
    internal_error: {code: -2, message: "Something evil happened."},
    invalid_create_data: {code: -3, message: "Something evil happened."},
    uniqueness_violation: { code: -4, message: "Duplicate identity or fields."},
    unknown_error: { code: -5, message: "Something unexpectedly bad happened."},
    login_failure: { code: -6, message: "Invalid login"},
    invalid_update_data: {code: -7, message: "Something evil happened."}
};
