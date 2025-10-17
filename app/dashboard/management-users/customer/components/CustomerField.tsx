'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FormError from '@/components/form-error';
import { Icon } from '@/components/icons/Icon';

interface BaseFieldProps {
  name: string;
  type: string;
  placeholder: string;
  className?: string;
  register: any;
  error?: string;
  isSubmitting: boolean;
  mode: 'new' | 'update';
}

interface SelectFieldProps extends BaseFieldProps {
  options?: Array<{ value: string; label: string }>
}

export default function CustomerField(props: SelectFieldProps) {
  const { name, type, placeholder, className, register, error, isSubmitting, options, mode } = props;

  const labelText = name === 'name' ? 'اسم العميل' : name === 'phone' ? 'رقم الهاتف' : name === 'password' ? 'كلمة المرور' : placeholder;
  const iconName = name === 'name' ? 'User' : name === 'phone' ? 'Phone' : name === 'password' ? 'Lock' : undefined;

  if (type === 'select' && options) {
    return (
      <div className={className}>
        <label className="text-xs text-muted-foreground mb-1 inline-block" htmlFor={`customer-${name}`}>{labelText}</label>
        <Select onValueChange={(value) => register(name).onChange({ target: { value } })} defaultValue={register(name).value} disabled={isSubmitting}>
          <SelectTrigger id={`customer-${name}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormError message={error} />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={className}>
        <label className="text-xs text-muted-foreground mb-1 inline-block" htmlFor={`customer-${name}`}>{labelText}</label>
        <Textarea id={`customer-${name}`} {...register} placeholder={placeholder} disabled={isSubmitting} rows={3} />
        <FormError message={error} />
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="text-xs text-muted-foreground mb-1 inline-block" htmlFor={`customer-${name}`}>{labelText}</label>
      <div className="relative">
        {iconName && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon name={iconName} className="h-4 w-4" />
          </span>
        )}
        <Input
          id={`customer-${name}`}
          {...register}
          type={type}
          placeholder={placeholder}
          disabled={isSubmitting}
          className={iconName ? 'pr-10' : ''}
          autoFocus={mode === 'new' && name === 'name'}
          autoComplete={
            name === 'password'
              ? (mode === 'new' ? 'new-password' : 'current-password')
              : name === 'phone'
                ? 'tel'
                : name
          }
          inputMode={name === 'phone' ? 'numeric' : undefined}
          pattern={name === 'phone' ? "\\d*" : undefined}
          maxLength={name === 'phone' ? 10 : undefined}
        />
      </div>
      <FormError message={error} />
    </div>
  );
}






