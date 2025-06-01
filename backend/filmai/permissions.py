from rest_framework.permissions import BasePermission


class IsMovieAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.project.created_by


class IsProjectAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.project.created_by


class IsChaptersAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.chapter.project.created_by


class IsPagesAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.page.chapter.project.created_by


class IsCharacterAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj.project.created_by


class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return user == obj


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_staff
        )

#
# class IsReadOnly(BasePermission):
#     def has_permission(self, request, view):
#         return bool(request.method in SAFE_METHODS)
#
#
# class IsCampaignOwner(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         business_user_profile = request.user.business_user_profile
#         return business_user_profile == obj.business_user_profile
#
#
# class IsOfferOwner(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         business_user_profile = request.user.business_user_profile
#         return business_user_profile == obj.business_user_profile
#
#
# class IsMessageAuthor(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         business_user_profile = request.user.business_user_profile
#         return business_user_profile == obj.business_user_profile
#
#
# class IsRevCat(BasePermission):
#     def has_permission(self, request, view):
#         print(request.user.email == 'recat@hook.com')
#         return bool(request.user.email == 'recat@hook.com')
