interface AuditConfirmationEmailProps {
  resultsUrl: string
  totalMonthlySavingsCents: number
  isAlreadyOptimal: boolean
  firstName?: string
}

export function AuditConfirmationEmail({
  resultsUrl,
  totalMonthlySavingsCents,
  isAlreadyOptimal,
  firstName,
}: AuditConfirmationEmailProps) {
  const savingsDollars = (totalMonthlySavingsCents / 100).toFixed(0)
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,'

  const bodyText = isAlreadyOptimal
    ? `Good news — your AI stack looks well-optimized. We didn't find meaningful savings, which means you're already on the right plans for your team size and use case.`
    : `Your AI spend audit found $${savingsDollars}/month in potential savings. The full breakdown is in your results.`

  // Plain HTML — no React Email dependency needed for a simple transactional email
  // React Email is useful for complex templates; this doesn't need it
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your AI spend audit results</title>
</head>
<body style="font-family: -apple-system, sans-serif; background: #f9f9f9; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; border: 1px solid #eee;">
    
    <p style="color: #111; font-size: 16px; margin: 0 0 16px;">${greeting}</p>
    
    <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      ${bodyText}
    </p>
    
    <a href="${resultsUrl}"
       style="display: inline-block; background: #00E5A0; color: #0A0A0B; text-decoration: none;
              font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 6px;">
      View your full audit →
    </a>
    
    <p style="color: #888; font-size: 12px; margin: 32px 0 0; line-height: 1.5;">
      This link is shareable — it shows your tool recommendations without any identifying
      information. Safe to send to your team or engineering manager.
      <br /><br />
      You received this because you ran an audit at [your-domain].com.
    </p>
  </div>
</body>
</html>
  `
}
