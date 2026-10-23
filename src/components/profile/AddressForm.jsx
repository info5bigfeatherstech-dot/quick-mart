import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhoneInput from '@/components/common/PhoneInput';
import { isValidIndianMobile, isValidPincode } from '@/utils/validators';
import { Loader2 } from 'lucide-react';

const INDIAN_STATES = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Punjab',
];

/**
 * Reusable AddressForm component for adding/editing delivery addresses
 */
const AddressForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    houseNo: initialData.houseNo || '',
    streetArea: initialData.streetArea || '',
    landmark: initialData.landmark || '',
    city: initialData.city || 'New Delhi',
    state: initialData.state || 'Delhi',
    pincode: initialData.pincode || '',
    type: initialData.type || 'Home',
    isDefault: initialData.isDefault || false,
  });

  const [touched, setTouched] = useState({});

  const errors = {
    name: touched.name && !formData.name.trim() ? 'Name is required' : '',
    phone:
      touched.phone && !isValidIndianMobile(formData.phone)
        ? 'Enter a valid 10-digit mobile number'
        : '',
    houseNo:
      touched.houseNo && !formData.houseNo.trim() ? 'House/Flat no. is required' : '',
    streetArea:
      touched.streetArea && !formData.streetArea.trim()
        ? 'Street/Area details are required'
        : '',
    city: touched.city && !formData.city.trim() ? 'City is required' : '',
    state: touched.state && !formData.state ? 'Please select a state' : '',
    pincode:
      touched.pincode && !isValidPincode(formData.pincode)
        ? 'Enter a valid 6-digit postal pincode'
        : '',
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    isValidIndianMobile(formData.phone) &&
    formData.houseNo.trim().length > 0 &&
    formData.streetArea.trim().length > 0 &&
    formData.city.trim().length > 0 &&
    Boolean(formData.state) &&
    isValidPincode(formData.pincode);

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
      houseNo: true,
      streetArea: true,
      city: true,
      state: true,
      pincode: true,
    });

    if (!isFormValid || isSubmitting) return;

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
      {/* Name and Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label htmlFor="addr-name" className="text-xs font-semibold">
            Contact Person <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addr-name"
            autoComplete="name"
            placeholder="e.g. Aarav Sharma"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            disabled={isSubmitting}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="addr-phone" className="text-xs font-semibold">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <PhoneInput
            id="addr-phone"
            value={formData.phone}
            onChange={(val) => handleChange('phone', val)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* House No & Street Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label htmlFor="addr-house" className="text-xs font-semibold">
            Flat / House / Building <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addr-house"
            autoComplete="address-line1"
            placeholder="e.g. Flat 402, Tower B"
            value={formData.houseNo}
            onChange={(e) => handleChange('houseNo', e.target.value)}
            onBlur={() => handleBlur('houseNo')}
            disabled={isSubmitting}
            className={errors.houseNo ? 'border-destructive' : ''}
          />
          {errors.houseNo && <p className="text-[11px] text-destructive">{errors.houseNo}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="addr-street" className="text-xs font-semibold">
            Street / Colony / Area <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addr-street"
            autoComplete="address-line2"
            placeholder="e.g. Connaught Place"
            value={formData.streetArea}
            onChange={(e) => handleChange('streetArea', e.target.value)}
            onBlur={() => handleBlur('streetArea')}
            disabled={isSubmitting}
            className={errors.streetArea ? 'border-destructive' : ''}
          />
          {errors.streetArea && <p className="text-[11px] text-destructive">{errors.streetArea}</p>}
        </div>
      </div>

      {/* Landmark & Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label htmlFor="addr-landmark" className="text-xs font-semibold">
            Landmark <span className="text-muted-foreground text-[10px] font-normal">(Optional)</span>
          </Label>
          <Input
            id="addr-landmark"
            placeholder="e.g. Near Metro Gate 2"
            value={formData.landmark}
            onChange={(e) => handleChange('landmark', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="addr-pincode" className="text-xs font-semibold">
            Postal Pincode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addr-pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="e.g. 110001"
            value={formData.pincode}
            onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
            onBlur={() => handleBlur('pincode')}
            disabled={isSubmitting}
            className={errors.pincode ? 'border-destructive' : ''}
          />
          {errors.pincode && <p className="text-[11px] text-destructive">{errors.pincode}</p>}
        </div>
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <Label htmlFor="addr-city" className="text-xs font-semibold">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="addr-city"
            autoComplete="address-level2"
            placeholder="e.g. New Delhi"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            disabled={isSubmitting}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && <p className="text-[11px] text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="addr-state" className="text-xs font-semibold">
            State <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.state}
            onValueChange={(val) => handleChange('state', val)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="addr-state" className="rounded-xl text-xs sm:text-sm">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state} className="text-xs sm:text-sm">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-[11px] text-destructive">{errors.state}</p>}
        </div>
      </div>

      {/* Address Type Radio */}
      <div className="space-y-2 pt-1">
        <Label className="text-xs font-semibold">Address Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(val) => handleChange('type', val)}
          className="flex items-center gap-4"
          disabled={isSubmitting}
        >
          {['Home', 'Work', 'Other'].map((type) => (
            <div key={type} className="flex items-center space-x-1.5">
              <RadioGroupItem value={type} id={`type-${type}`} />
              <Label htmlFor={`type-${type}`} className="text-xs font-medium cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center space-x-2 pt-1">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => handleChange('isDefault', !!checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="isDefault" className="text-xs text-foreground cursor-pointer font-medium">
          Make this my default delivery address
        </Label>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={!isFormValid || isSubmitting}
          className="rounded-xl px-5 font-semibold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
