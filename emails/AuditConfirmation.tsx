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

  const subject = isAlreadyOptimal
    ? `Your AI stack is already optimized`
    : `You found $${savingsDollars}/month in AI savings`

  const bodyText = isAlreadyOptimal
    ? `Good news — your AI stack looks well-optimized. We didn't find meaningful savings, which means you're already on the right plans for your team size and use case.`
    : `Your AI spend audit found $${savingsDollars}/month in potential savings. The full breakdown is linked below.`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="background:#ffffff;margin:0;padding:0;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;border:2px solid #000000;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:2px solid #000000;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#000000;">
                stacktally.
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <p style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#666666;margin:0 0 24px;">
                // AI Spend Audit
              </p>

              <p style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#000000;margin:0 0 8px;line-height:1.1;">
                ${isAlreadyOptimal ? 'Already Optimized' : `$${savingsDollars}/mo`}
              </p>
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#666666;margin:0 0 32px;line-height:1.5;">
                ${isAlreadyOptimal ? 'in potential monthly savings' : 'in potential monthly savings identified'}
              </p>

              <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#333333;line-height:1.7;margin:0 0 40px;">
                ${greeting}<br/><br/>${bodyText}
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000000;">
                    <a href="${resultsUrl}"
                       style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;
                              font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;
                              letter-spacing:0.15em;text-transform:uppercase;padding:14px 28px;">
                      View Full Audit →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:2px solid #000000;">
              <p style="font-family:'Courier New',Courier,monospace;font-size:10px;color:#999999;margin:0;letter-spacing:0.1em;text-transform:uppercase;line-height:1.6;">
                No spam. One transactional email with your results.<br/>
                This link is shareable — no personal data is exposed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
