# Contact Management System Setup Guide

## Overview
The SUN AUTOCORECT application now includes a comprehensive contact management system that allows administrators to update contact information (phone, email, address, working hours) from the admin panel. This information is automatically displayed throughout the application in the footer, contact page, and other relevant locations.

## Features
- **Dynamic Contact Information**: All contact details are now managed from a central database
- **Admin Panel Integration**: New "Contact" tab in the admin dashboard
- **Real-time Updates**: Changes are immediately reflected across the application
- **Fallback Support**: Graceful fallback to default values if database is unavailable

## Database Setup

### 1. Run the SQL Script
Execute the `supabase-contact-info.sql` file in your Supabase SQL editor:

```sql
-- Create contact_info table for storing company contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact information
INSERT INTO contact_info (phone, email, address, working_hours) VALUES (
  '+40 721 234 567',
  'office@sunautocorect.ro',
  'Strada Principală 123, București',
  'Lun-Vin: 9:00-18:00, Sâmbătă: 9:00-14:00, Duminică: Închis'
) ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_info_updated_at 
    BEFORE UPDATE ON contact_info 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON contact_info TO authenticated;
GRANT SELECT ON contact_info TO anon;
```

### 2. Verify Table Creation
Check that the table was created successfully in your Supabase dashboard under Database > Tables.

## Application Components

### New Files Created
1. **`src/lib/contact-context.tsx`** - React context for managing contact information
2. **`src/components/admin/ContactManagement.tsx`** - Admin component for editing contact info
3. **`supabase-contact-info.sql`** - Database setup script

### Updated Files
1. **`src/lib/supabase.ts`** - Added ContactInfo interface
2. **`src/lib/services.ts`** - Added contactService
3. **`src/pages/Admin.tsx`** - Added Contact tab
4. **`src/App.tsx`** - Wrapped with ContactProvider
5. **`src/components/Footer.tsx`** - Dynamic contact info
6. **`src/pages/Contact.tsx`** - Dynamic contact info
7. **`src/pages/About.tsx`** - Dynamic contact info
8. **`src/pages/CarDetails.tsx`** - Dynamic contact info
9. **`src/components/StickyCTA.tsx`** - Dynamic contact info
10. **`src/components/FloatingButtons.tsx`** - Dynamic contact info
11. **`src/components/Navigation.tsx`** - Dynamic contact info
12. **`src/pages/StockCars.tsx`** - Dynamic contact info

## Usage

### 1. Access Contact Management
1. Log in to the admin panel (`/admin`)
2. Click on the "Contact" tab (phone icon)
3. You'll see the current contact information and edit forms

### 2. Edit Contact Information
1. **Phone Number**: Update the company phone number
2. **Email**: Update the company email address
3. **Address**: Update the complete company address
4. **Working Hours**: Update the business hours (use Enter for line breaks)

### 3. Save Changes
1. Click "Salvează modificările" to save
2. Changes are immediately reflected across the application
3. Use "Resetează" to revert to the last saved version

## Contact Information Display

### Where Contact Info Appears
- **Footer**: Phone, email, address, working hours
- **Contact Page**: All contact details with clickable links
- **About Page**: Contact section and working hours
- **Car Details**: Contact information sidebar
- **Navigation**: Phone number in header
- **Floating Buttons**: WhatsApp integration
- **Sticky CTA**: Contact buttons

### Fallback Behavior
If the database is unavailable or contact info hasn't been set:
- Default values are displayed
- Loading states are shown while fetching data
- Error states gracefully degrade

## Technical Details

### Database Schema
```typescript
interface ContactInfo {
  id: number
  phone: string
  email: string
  address: string
  working_hours: string
  created_at: string
  updated_at: string
}
```

### Context API
The `useContact()` hook provides:
- `contactInfo`: Current contact information
- `loading`: Loading state
- `updateContactInfo()`: Function to update contact info
- `refreshContactInfo()`: Function to refresh data

### Service Layer
The `contactService` provides:
- `getContactInfo()`: Fetch current contact info
- `updateContactInfo()`: Update contact information

## Security Considerations

### Permissions
- **Authenticated users**: Can read and update contact info
- **Anonymous users**: Can only read contact info
- **Admin access**: Required to modify contact information

### Validation
- Phone number format validation
- Email format validation
- Required field validation
- XSS protection through React's built-in escaping

## Troubleshooting

### Common Issues

1. **Contact info not loading**
   - Check database connection
   - Verify table exists and has data
   - Check browser console for errors

2. **Changes not saving**
   - Verify admin permissions
   - Check form validation
   - Ensure all required fields are filled

3. **Contact info not updating across app**
   - Refresh the page
   - Check if ContactProvider is properly wrapped
   - Verify context is being used in components

### Debug Steps
1. Check browser console for errors
2. Verify database table structure
3. Test admin permissions
4. Check network requests in DevTools

## Future Enhancements

### Potential Improvements
- **Multiple contact profiles**: Support for different locations
- **Contact form management**: Admin control over contact form fields
- **Social media links**: Manage social media URLs
- **Business hours calendar**: Visual calendar for working hours
- **Contact info versioning**: Track changes over time
- **Bulk import/export**: CSV support for contact data

### Integration Opportunities
- **CRM systems**: Sync with customer relationship management
- **Calendar systems**: Integrate with business hours
- **Communication platforms**: Connect with phone/email systems
- **Analytics**: Track contact information usage

## Support

For technical support or questions about the contact management system:
1. Check this documentation
2. Review the code comments
3. Check the browser console for errors
4. Verify database setup and permissions

---

**Note**: This system replaces all hardcoded contact information throughout the application. Make sure to update the default values in the SQL script to match your actual business information before deploying to production.
