import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PhoneInput from '@/components/common/PhoneInput';
import { useContactInfo } from '@/hooks/useContactInfo';
import { useSubmitContact } from '@/hooks/useSubmitContact';
import { isValidIndianMobile, isValidEmail } from '@/utils/validators';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * ContactUs page with support info cards and validated contact form
 */
const ContactUs = () => {
  const { data: contact, isLoading: isContactLoading } = useContactInfo();
  const submitMutation = useSubmitContact();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    message: false,
  });

  // Validation checks
  const errors = {
    name:
      touched.name && !formData.name.trim() ? 'Please enter your full name' : '',
    phone:
      touched.phone && !isValidIndianMobile(formData.phone)
        ? 'Enter a valid 10-digit mobile number'
        : '',
    email:
      touched.email && !isValidEmail(formData.email)
        ? 'Enter a valid email address (e.g. name@example.com)'
        : '',
    message:
      touched.message && formData.message.trim().length < 10
        ? 'Message must be at least 10 characters long'
        : '',
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    isValidIndianMobile(formData.phone) &&
    isValidEmail(formData.email) &&
    formData.message.trim().length >= 10;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      email: true,
      message: true,
    });

    if (!isFormValid || submitMutation.isPending) return;

    submitMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
        });
        setTouched({
          name: false,
          phone: false,
          email: false,
          message: false,
        });
      },
    });
  };

  return (
    <div className="pb-16">
      <PageHeader
        title="Contact Customer Support"
        subtitle="Have a question about your grocery order or delivery? Our 24/7 dark-store support team is here to assist you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-medium text-foreground">
            Get in touch directly
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Reach out via phone, email, or visit our central operational office in New Delhi.
          </p>

          {isContactLoading ? (
            <div className="space-y-3 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {/* Email Block */}
              {contact?.email && (
                <Card className="p-4 bg-card border-border rounded-xl flex items-start gap-3.5 transition-all hover:border-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {contact.email.label}
                    </h3>
                    <a
                      href={contact.email.link}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors block mt-0.5"
                    >
                      {contact.email.value}
                    </a>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {contact.email.subtext}
                    </span>
                  </div>
                </Card>
              )}

              {/* Phone Block */}
              {contact?.phone && (
                <Card className="p-4 bg-card border-border rounded-xl flex items-start gap-3.5 transition-all hover:border-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {contact.phone.label}
                    </h3>
                    <a
                      href={contact.phone.link}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors block mt-0.5"
                    >
                      {contact.phone.value}
                    </a>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {contact.phone.subtext}
                    </span>
                  </div>
                </Card>
              )}

              {/* Support Hours Block */}
              {contact?.hours && (
                <Card className="p-4 bg-card border-border rounded-xl flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {contact.hours.label}
                    </h3>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {contact.hours.value}
                    </p>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {contact.hours.subtext}
                    </span>
                  </div>
                </Card>
              )}

              {/* Address Block */}
              {contact?.address && (
                <Card className="p-4 bg-card border-border rounded-xl flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {contact.address.label}
                    </h3>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {contact.address.value}
                    </p>
                    <span className="text-[11px] text-muted-foreground block mt-0.5 leading-snug">
                      {contact.address.subtext}
                    </span>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-card border-border rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium text-foreground">
              Send us a message
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Fill out the details below and an instant support representative will reach out.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="contact-name" className="text-xs font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-name"
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  disabled={submitMutation.isPending}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <Label htmlFor="contact-phone" className="text-xs font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <PhoneInput
                  id="contact-phone"
                  value={formData.phone}
                  onChange={(val) => handleChange('phone', val)}
                  onBlur={() => handleBlur('phone')}
                  error={errors.phone}
                  disabled={submitMutation.isPending}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="contact-email" className="text-xs font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  disabled={submitMutation.isPending}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="contact-message" className="text-xs font-medium">
                  Message / Order Details <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Please describe your query, missing order items, or dark-store feedback..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  disabled={submitMutation.isPending}
                  className={`rounded-xl resize-none ${errors.message ? 'border-destructive' : ''}`}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={!isFormValid || submitMutation.isPending}
                className="w-full h-11 rounded-xl text-sm font-medium gap-2 mt-2"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Message</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
