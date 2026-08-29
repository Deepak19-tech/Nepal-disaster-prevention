from django.conf import settings
from django.db import models

class District(models.Model):
    name = models.CharField(max_length=120)
    province = models.CharField(max_length=120)
    risk_score = models.PositiveSmallIntegerField(default=0)
    risk_level = models.CharField(max_length=20, choices=[('stable','Stable'),('watch','Watch'),('elevated','Elevated'),('high','High')], default='stable')
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class Alert(models.Model):
    code = models.CharField(max_length=32, unique=True)
    title = models.CharField(max_length=220)
    body = models.TextField()
    disaster_type = models.CharField(max_length=64)
    severity = models.CharField(max_length=20, choices=[('info','Info'),('action','Action'),('urgent','Urgent'),('critical','Critical')])
    affected_areas = models.TextField()
    recommended_actions = models.TextField()
    status = models.CharField(max_length=20, choices=[('draft','Draft'),('published','Published'),('resolved','Resolved')], default='draft')
    published_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='published_alerts')
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Incident(models.Model):
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='incident_reports')
    disaster_type = models.CharField(max_length=64)
    location = models.CharField(max_length=240)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    severity = models.CharField(max_length=20, choices=[('moderate','Moderate'),('high','High'),('critical','Critical')])
    description = models.TextField()
    contact_details = models.CharField(max_length=160, blank=True)
    status = models.CharField(max_length=20, choices=[('submitted','Submitted'),('reviewing','Reviewing'),('verified','Verified'),('resolved','Resolved'),('rejected','Rejected')], default='submitted')
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='reviewed_incidents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PreparednessResource(models.Model):
    title = models.CharField(max_length=180)
    disaster_type = models.CharField(max_length=64)
    summary = models.TextField()
    body = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

class EmergencyContact(models.Model):
    label = models.CharField(max_length=120)
    number = models.CharField(max_length=32)
    description = models.CharField(max_length=180)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='disaster_notifications')
    title = models.CharField(max_length=180)
    body = models.TextField()
    kind = models.CharField(max_length=64)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ExternalDataSnapshot(models.Model):
    source = models.CharField(max_length=120)
    category = models.CharField(max_length=64)
    payload = models.JSONField()
    observed_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
