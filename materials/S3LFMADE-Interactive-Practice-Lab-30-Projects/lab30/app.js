// S3LFM@DE Solutions Interactive Practice Lab
// This file is intentionally readable so you can study and edit it safely.

const projects = [
  {
    id: 'resume', code: 'S3L-LAB-001', title: 'Resume Practice',
    description: 'Practice collecting complete resume information and checking whether important fields are missing.',
    fields: [
      {name:'fullName', label:'Full Name', type:'text', required:true, min:3, sample:'Jordan Matthews'},
      {name:'jobTitle', label:'Target Job Title', type:'text', required:true, min:3, sample:'Administrative Professional'},
      {name:'email', label:'Email', type:'email', required:true, sample:'jordan@example.com'},
      {name:'phone', label:'Phone', type:'tel', required:true, pattern:'phone', sample:'901-555-0142'},
      {name:'summary', label:'Professional Summary', type:'textarea', required:true, min:50, sample:'Organized administrative professional with experience supporting daily operations, maintaining records, coordinating schedules, and assisting customers in fast-paced environments.'},
      {name:'skills', label:'Core Skills', type:'textarea', required:true, min:15, sample:'Microsoft Office, scheduling, customer service, data entry, records management'},
      {name:'experience', label:'Work Experience', type:'textarea', required:true, min:50, sample:'Office Assistant — Brightway Services\n2022–2025\nMaintained records, prepared documents, coordinated appointments, and assisted customers.'},
      {name:'education', label:'Education', type:'text', required:true, min:5, sample:'A.A.S. Business Technology'}
    ]
  },
  {
    id: 'flyer', code: 'S3L-LAB-002', title: 'Flyer Practice',
    description: 'Practice gathering the information needed for a clear event or business flyer.',
    fields: [
      {name:'headline', label:'Main Headline', type:'text', required:true, min:4, sample:'THE IVORY ROOM GRAND OPENING'},
      {name:'eventDate', label:'Event Date', type:'date', required:true, sample:'2026-10-17'},
      {name:'eventTime', label:'Event Time', type:'time', required:true, sample:'18:00'},
      {name:'location', label:'Location', type:'text', required:true, min:5, sample:'123 Main Street'},
      {name:'details', label:'Key Details', type:'textarea', required:true, min:20, sample:'Live music, food, giveaways, and opening-night specials.'},
      {name:'style', label:'Style Direction', type:'select', required:true, options:['Elegant','Classic','Modern','Fun & Colorful'], sample:'Elegant'},
      {name:'callToAction', label:'Call to Action', type:'text', required:true, min:4, sample:'Join us for opening night!'}
    ]
  },
  {
    id: 'church', code: 'S3L-LAB-003', title: 'Church Program Practice',
    description: 'Practice organizing a church program with a complete event flow.',
    fields: [
      {name:'churchName', label:'Church Name', type:'text', required:true, min:4, sample:'New Hope Community Church'},
      {name:'programTitle', label:'Program Title', type:'text', required:true, min:4, sample:'25th Anniversary Celebration'},
      {name:'theme', label:'Theme', type:'text', required:true, min:4, sample:'Faithful Through the Years'},
      {name:'serviceDate', label:'Service Date', type:'date', required:true, sample:'2026-10-18'},
      {name:'serviceTime', label:'Service Time', type:'time', required:true, sample:'15:00'},
      {name:'order', label:'Order of Service', type:'textarea', required:true, min:40, sample:'Welcome\nOpening Prayer\nMusical Selection\nAnniversary Message\nOffering\nClosing Remarks'},
      {name:'speaker', label:'Guest Speaker / Honoree', type:'text', required:false, sample:'Rev. A. Johnson'}
    ]
  },
  {
    id: 'memorial', code: 'S3L-LAB-004', title: 'Memorial Program Practice',
    description: 'Practice collecting respectful memorial-program information and spotting missing sections.',
    fields: [
      {name:'honoree', label:'Name of Loved One', type:'text', required:true, min:3, sample:'Evelyn Grace Carter'},
      {name:'birthDate', label:'Birth Date', type:'date', required:true, sample:'1948-04-12'},
      {name:'passingDate', label:'Passing Date', type:'date', required:true, sample:'2026-09-28'},
      {name:'serviceDate', label:'Service Date', type:'date', required:true, sample:'2026-10-04'},
      {name:'serviceLocation', label:'Service Location', type:'text', required:true, min:5, sample:'Grace Memorial Chapel'},
      {name:'obituary', label:'Obituary / Life Story', type:'textarea', required:true, min:80, sample:'Evelyn Grace Carter was loved for her kindness, devotion to family, and generous spirit. She spent her life encouraging others and creating lasting memories with everyone around her.'},
      {name:'order', label:'Order of Service', type:'textarea', required:true, min:30, sample:'Processional\nScripture\nPrayer\nMusical Selection\nReflections\nEulogy\nRecessional'},
      {name:'acknowledgement', label:'Family Acknowledgement', type:'textarea', required:true, min:25, sample:'The family sincerely thanks everyone for the prayers, calls, visits, and acts of kindness shown during this time.'}
    ]
  },
  {
    id: 'event', code: 'S3L-LAB-005', title: 'Event Planning Practice',
    description: 'Practice building a usable event brief before you begin planning.',
    fields: [
      {name:'eventName', label:'Event Name', type:'text', required:true, min:4, sample:'Elegant 50th Birthday Dinner'},
      {name:'eventDate', label:'Event Date', type:'date', required:true, sample:'2026-11-14'},
      {name:'guestCount', label:'Estimated Guest Count', type:'number', required:true, minValue:1, sample:'60'},
      {name:'budget', label:'Estimated Budget', type:'number', required:true, minValue:1, sample:'5000'},
      {name:'venue', label:'Venue / Location', type:'text', required:true, min:4, sample:'The Garden Hall'},
      {name:'palette', label:'Color / Decor Direction', type:'text', required:true, min:4, sample:'Burgundy, ivory, and gold'},
      {name:'vendors', label:'Vendors Needed', type:'textarea', required:true, min:20, sample:'Caterer, decorator, photographer, DJ, cake designer'},
      {name:'timeline', label:'Day-of Timeline', type:'textarea', required:true, min:30, sample:'4:00 PM Vendor setup\n6:00 PM Guest arrival\n6:30 PM Dinner\n7:30 PM Toasts\n8:00 PM Music and celebration'}
    ]
  },
  {
    id: 'bookkeeping', code: 'S3L-LAB-006', title: 'Bookkeeping Entry Practice',
    description: 'Practice entering a complete expense record and checking amount/category information.',
    fields: [
      {name:'entryDate', label:'Transaction Date', type:'date', required:true, sample:'2026-09-24'},
      {name:'vendor', label:'Vendor', type:'text', required:true, min:2, sample:'Office Depot'},
      {name:'category', label:'Category', type:'select', required:true, options:['Office Supplies','Advertising','Software','Travel','Utilities','Other'], sample:'Office Supplies'},
      {name:'amount', label:'Amount ($)', type:'number', required:true, minValue:0.01, sample:'126.40'},
      {name:'paymentMethod', label:'Payment Method', type:'select', required:true, options:['Cash','Debit Card','Credit Card','Bank Transfer','Other'], sample:'Debit Card'},
      {name:'receipt', label:'Receipt / Reference Number', type:'text', required:false, sample:'RCP-2048'},
      {name:'notes', label:'Business Purpose / Notes', type:'textarea', required:true, min:15, sample:'Printer paper, ink, folders, and mailing supplies for client work.'}
    ]
  },
  {
    id: 'letter', code: 'S3L-LAB-007', title: 'Business Letter Practice',
    description: 'Practice composing a complete business letter with a clear purpose and call to action.',
    fields: [
      {name:'recipient', label:'Recipient Name', type:'text', required:true, min:3, sample:'Ms. Renee Parker'},
      {name:'company', label:'Company / Organization', type:'text', required:false, sample:'Parker Community Services'},
      {name:'subject', label:'Subject', type:'text', required:true, min:5, sample:'Follow-Up Regarding Service Request'},
      {name:'greeting', label:'Greeting', type:'text', required:true, min:3, sample:'Dear Ms. Parker,'},
      {name:'message', label:'Letter Body', type:'textarea', required:true, min:80, sample:'Thank you for the opportunity to assist with your project. I am following up to confirm the requested revisions and next steps. Please review the attached proof and reply with any final corrections before approval.'},
      {name:'cta', label:'Call to Action', type:'text', required:true, min:10, sample:'Please review and respond by Friday.'},
      {name:'closing', label:'Closing', type:'text', required:true, min:3, sample:'Sincerely, Templar Hughes-Bryant'}
    ]
  },
  {
    id: 'presentation', code: 'S3L-LAB-008', title: 'Presentation Planning Practice',
    description: 'Practice planning the structure of a clear PowerPoint before designing slides.',
    fields: [
      {name:'presentationTitle', label:'Presentation Title', type:'text', required:true, min:4, sample:'Small Business Growth Plan'},
      {name:'audience', label:'Audience', type:'text', required:true, min:4, sample:'Small business owner and team'},
      {name:'goal', label:'Presentation Goal', type:'textarea', required:true, min:25, sample:'Explain a practical plan for improving customer experience, marketing, daily operations, and follow-up.'},
      {name:'slides', label:'Planned Slide Topics', type:'textarea', required:true, min:40, sample:'1. Title\n2. Current Goals\n3. Customer Experience\n4. Marketing\n5. Operations\n6. Next Steps'},
      {name:'style', label:'Visual Style', type:'select', required:true, options:['Executive','Elegant','Modern','Bold','Minimal'], sample:'Executive'},
      {name:'speakerNotes', label:'Speaker Notes / Key Talking Points', type:'textarea', required:false, sample:'Keep text concise and explain details verbally instead of crowding the slides.'}
    ]
  },
  {
    id: 'research', code: 'S3L-LAB-009', title: 'Research & Editing Practice',
    description: 'Practice organizing a research brief and checking whether it has the pieces needed for editing support.',
    fields: [
      {name:'topic', label:'Research Topic', type:'text', required:true, min:5, sample:'Community Youth Mentoring Programs'},
      {name:'purpose', label:'Purpose / Research Question', type:'textarea', required:true, min:30, sample:'Identify common features of effective youth mentoring programs and summarize practical ideas for a local community initiative.'},
      {name:'findings', label:'Key Findings', type:'textarea', required:true, min:60, sample:'Strong programs commonly use trained mentors, clear participation expectations, consistent meeting schedules, family communication, and measurable goals.'},
      {name:'sources', label:'Source List', type:'textarea', required:true, min:25, sample:'Source 1: Organization report\nSource 2: Peer-reviewed article\nSource 3: Government youth-program guide'},
      {name:'citationStyle', label:'Citation Style', type:'select', required:true, options:['APA','MLA','Chicago','Other / Not Required'], sample:'APA'},
      {name:'recommendations', label:'Recommendations / Next Steps', type:'textarea', required:true, min:30, sample:'Develop a pilot program, create mentor training materials, define attendance expectations, and choose simple measures for participation and progress.'}
    ]
  },
  {
    id: 'businesscard', code: 'S3L-LAB-010', title: 'Business Card Practice',
    description: 'Practice checking that the key business-card information is complete and concise.',
    fields: [
      {name:'businessName', label:'Business Name', type:'text', required:true, min:3, sample:'S3LFM@DE Solutions'},
      {name:'personName', label:'Name', type:'text', required:true, min:3, sample:'Templar Hughes-Bryant'},
      {name:'role', label:'Title / Role', type:'text', required:true, min:3, sample:'Founder & CEO'},
      {name:'tagline', label:'Tagline', type:'text', required:false, sample:'Your Vision. My Code. Real Solutions.'},
      {name:'email', label:'Business Email', type:'email', required:true, sample:'hello@example.com'},
      {name:'phone', label:'Business Phone', type:'tel', required:true, pattern:'phone', sample:'901-555-0100'},
      {name:'website', label:'Website', type:'url', required:true, sample:'https://example.com'}
    ]
  },
  {
    id: 'invitation', code: 'S3L-LAB-011', title: 'Invitation Practice',
    description: 'Practice collecting all event details before designing an invitation.',
    fields: [
      {name:'eventTitle', label:'Event Title', type:'text', required:true, min:4, sample:'An Evening of Elegance'},
      {name:'host', label:'Host / Honoree', type:'text', required:true, min:3, sample:'The Carter Family'},
      {name:'date', label:'Date', type:'date', required:true, sample:'2026-10-17'},
      {name:'time', label:'Time', type:'time', required:true, sample:'19:00'},
      {name:'venue', label:'Venue', type:'text', required:true, min:4, sample:'The Grand Ballroom'},
      {name:'dressCode', label:'Dress Code', type:'text', required:false, sample:'Cocktail Attire'},
      {name:'rsvp', label:'RSVP Instructions', type:'text', required:true, min:8, sample:'RSVP by October 5 through the event website.'},
      {name:'style', label:'Design Style', type:'select', required:true, options:['Elegant','Classic','Modern','Fun & Colorful'], sample:'Elegant'}
    ]
  },
  {
    id: 'dataentry', code: 'S3L-LAB-012', title: 'Spreadsheet & Data Entry Practice',
    description: 'Practice entering clean project-tracker data with valid dates, statuses, and balances.',
    fields: [
      {name:'projectName', label:'Project Name', type:'text', required:true, min:3, sample:'Flyer Design'},
      {name:'clientName', label:'Client Name', type:'text', required:true, min:3, sample:'Jordan Lee'},
      {name:'status', label:'Status', type:'select', required:true, options:['New','In Progress','Waiting on Client','Proof Ready','Complete'], sample:'In Progress'},
      {name:'dueDate', label:'Due Date', type:'date', required:true, sample:'2026-10-02'},
      {name:'total', label:'Project Total ($)', type:'number', required:true, minValue:0, sample:'75'},
      {name:'paid', label:'Amount Paid ($)', type:'number', required:true, minValue:0, sample:'25'},
      {name:'notes', label:'Notes', type:'textarea', required:false, sample:'Waiting on final event address from client.'}
    ],
    extraValidation(values) {
      const total = Number(values.total || 0);
      const paid = Number(values.paid || 0);
      return paid > total ? 'Amount paid cannot be greater than the project total.' : '';
    }
  },
  {
    id: 'invoice', code: 'S3L-LAB-013', title: 'Invoice & Quote Practice',
    description: 'Bonus practice: validate invoice details and calculate total, deposit, and balance.',
    fields: [
      {name:'invoiceNumber', label:'Invoice Number', type:'text', required:true, min:3, sample:'INV-1001'},
      {name:'clientName', label:'Client Name', type:'text', required:true, min:3, sample:'Taylor Reed'},
      {name:'service', label:'Service', type:'text', required:true, min:3, sample:'Website Landing Page'},
      {name:'quantity', label:'Quantity', type:'number', required:true, minValue:1, sample:'1'},
      {name:'rate', label:'Rate ($)', type:'number', required:true, minValue:0, sample:'350'},
      {name:'deposit', label:'Deposit Paid ($)', type:'number', required:true, minValue:0, sample:'100'},
      {name:'dueDate', label:'Due Date', type:'date', required:true, sample:'2026-10-10'},
      {name:'paymentTerms', label:'Payment Terms', type:'textarea', required:true, min:20, sample:'Remaining balance is due before final files or completed services are released.'}
    ],
    extraValidation(values) {
      const total = Number(values.quantity || 0) * Number(values.rate || 0);
      const dep = Number(values.deposit || 0);
      return dep > total ? 'Deposit cannot be greater than the invoice total.' : '';
    },
    calculate(values) {
      const total = Number(values.quantity || 0) * Number(values.rate || 0);
      const deposit = Number(values.deposit || 0);
      return { total, deposit, balance: Math.max(0, total - deposit) };
    }
  },
  {
    id: 'coverletter', code: 'S3L-LAB-014', title: 'Cover Letter Practice',
    description: 'Practice collecting the details needed for a focused cover letter and checking whether the message is complete.',
    fields: [
      {name:'applicant', label:'Applicant Name', type:'text', required:true, min:3, sample:'Jordan Matthews'},
      {name:'jobTitle', label:'Job Title', type:'text', required:true, min:3, sample:'Administrative Coordinator'},
      {name:'employer', label:'Employer', type:'text', required:true, min:3, sample:'Brightway Services'},
      {name:'contact', label:'Hiring Contact', type:'text', required:false, sample:'Ms. Renee Parker'},
      {name:'opening', label:'Opening Paragraph', type:'textarea', required:true, min:50, sample:'I am applying for the Administrative Coordinator position because my background in office support, scheduling, records management, and customer service closely matches the needs described in the posting.'},
      {name:'strengths', label:'Relevant Strengths', type:'textarea', required:true, min:40, sample:'My experience includes preparing documents, maintaining accurate records, coordinating calendars, handling customer requests, and using Microsoft Office tools.'},
      {name:'closing', label:'Closing Paragraph', type:'textarea', required:true, min:35, sample:'I would welcome the opportunity to discuss how my experience can support your team. Thank you for your time and consideration.'}
    ]
  },
  {
    id: 'bio', code: 'S3L-LAB-015', title: 'Professional Bio Practice',
    description: 'Practice writing a concise professional biography for a website, program, profile, or portfolio.',
    fields: [
      {name:'name', label:'Name', type:'text', required:true, min:3, sample:'Alex Morgan'},
      {name:'role', label:'Role / Title', type:'text', required:true, min:3, sample:'Founder & Creative Services Specialist'},
      {name:'background', label:'Background', type:'textarea', required:true, min:50, sample:'Alex has a background in technology, office administration, document design, and digital tools, with a focus on helping clients turn ideas into practical finished work.'},
      {name:'strengths', label:'Key Strengths', type:'textarea', required:true, min:25, sample:'Detail-focused work, clear communication, organized workflows, adaptable design, and dependable follow-through.'},
      {name:'personalTouch', label:'Personal Touch', type:'textarea', required:false, sample:'Outside of work, Alex enjoys learning new technology and finding better ways to organize everyday tasks.'}
    ]
  },
  {
    id: 'clientintake', code: 'S3L-LAB-016', title: 'Client Intake Form Practice',
    description: 'Practice building a complete client intake record before starting a project.',
    fields: [
      {name:'clientName', label:'Client Name', type:'text', required:true, min:3, sample:'Taylor Reed'},
      {name:'email', label:'Email', type:'email', required:true, sample:'taylor@example.com'},
      {name:'phone', label:'Phone', type:'tel', required:true, pattern:'phone', sample:'901-555-0177'},
      {name:'service', label:'Requested Service', type:'select', required:true, options:['Website','Flyer / Poster / Banner','Resume / Cover Letter','Event Planning','Bookkeeping Support','Microsoft Office / Clerical','Other'], sample:'Flyer / Poster / Banner'},
      {name:'deadline', label:'Requested Deadline', type:'date', required:true, sample:'2026-10-30'},
      {name:'budget', label:'Budget Range', type:'select', required:true, options:['Under $100','$100–$249','$250–$499','$500+','Not sure yet'], sample:'$100–$249'},
      {name:'details', label:'Project Details', type:'textarea', required:true, min:60, sample:'I need a polished promotional flyer for a community event. The design should include the event title, date, location, guest information, and a clear call to action.'}
    ]
  },
  {
    id: 'agenda', code: 'S3L-LAB-017', title: 'Meeting Agenda Practice',
    description: 'Practice structuring a clear agenda with purpose, timing, attendees, and action items.',
    fields: [
      {name:'meetingTitle', label:'Meeting Title', type:'text', required:true, min:4, sample:'October Project Planning Meeting'},
      {name:'date', label:'Meeting Date', type:'date', required:true, sample:'2026-10-05'},
      {name:'time', label:'Start Time', type:'time', required:true, sample:'10:00'},
      {name:'attendees', label:'Attendees', type:'textarea', required:true, min:10, sample:'Project lead, designer, client representative'},
      {name:'purpose', label:'Meeting Purpose', type:'textarea', required:true, min:25, sample:'Review the current project scope, confirm missing materials, assign next steps, and set the next review date.'},
      {name:'topics', label:'Agenda Topics', type:'textarea', required:true, min:40, sample:'1. Project status\n2. Missing information\n3. Design direction\n4. Deadlines\n5. Assigned next steps'},
      {name:'actions', label:'Expected Action Items', type:'textarea', required:true, min:20, sample:'Confirm final wording, send remaining images, update timeline, schedule proof review.'}
    ]
  },
  {
    id: 'proofreading', code: 'S3L-LAB-018', title: 'Proofreading & Editing Practice',
    description: 'Practice documenting an editing job and identifying the checks that should happen before delivery.',
    fields: [
      {name:'documentTitle', label:'Document Title', type:'text', required:true, min:3, sample:'Community Program Proposal'},
      {name:'documentType', label:'Document Type', type:'select', required:true, options:['Essay','Research Paper','Business Document','Resume','Program','Website Copy','Other'], sample:'Business Document'},
      {name:'goal', label:'Editing Goal', type:'textarea', required:true, min:30, sample:'Improve grammar, sentence flow, consistency, formatting, and readability without changing the writer’s intended meaning.'},
      {name:'issues', label:'Problems Found', type:'textarea', required:true, min:30, sample:'Inconsistent heading sizes, repeated wording, comma errors, uneven spacing, and two paragraphs that need clearer transitions.'},
      {name:'changes', label:'Changes Made', type:'textarea', required:true, min:35, sample:'Corrected grammar and punctuation, standardized headings, tightened repeated phrases, adjusted spacing, and improved paragraph transitions.'},
      {name:'finalCheck', label:'Final Quality Check', type:'textarea', required:true, min:25, sample:'Re-read the full document, verified formatting consistency, checked names and dates, and confirmed all requested edits were addressed.'}
    ]
  },
  {
    id: 'vendorsheet', code: 'S3L-LAB-019', title: 'Event Vendor Sheet Practice',
    description: 'Practice tracking vendor responsibilities, contact details, costs, and deadlines for an event.',
    fields: [
      {name:'eventName', label:'Event Name', type:'text', required:true, min:4, sample:'Elegant 50th Birthday Dinner'},
      {name:'vendor', label:'Vendor Name', type:'text', required:true, min:3, sample:'Golden Table Catering'},
      {name:'category', label:'Vendor Category', type:'select', required:true, options:['Venue','Catering','Decor','Music / DJ','Photography','Cake / Dessert','Other'], sample:'Catering'},
      {name:'contact', label:'Vendor Contact', type:'tel', required:true, pattern:'phone', sample:'901-555-0190'},
      {name:'cost', label:'Quoted Cost ($)', type:'number', required:true, minValue:0, sample:'1850'},
      {name:'due', label:'Payment / Confirmation Due', type:'date', required:true, sample:'2026-10-25'},
      {name:'deliverables', label:'What Vendor Is Providing', type:'textarea', required:true, min:25, sample:'Buffet dinner for 60 guests, nonalcoholic beverages, setup, serving staff, and cleanup.'}
    ]
  },
  {
    id: 'birthdayplan', code: 'S3L-LAB-020', title: 'Birthday Event Plan Practice',
    description: 'Practice turning a celebration idea into an organized event brief with schedule and budget details.',
    fields: [
      {name:'honoree', label:'Honoree', type:'text', required:true, min:3, sample:'Morgan Lee'},
      {name:'theme', label:'Theme', type:'text', required:true, min:3, sample:'Bold & Beautiful at 40'},
      {name:'date', label:'Event Date', type:'date', required:true, sample:'2026-11-21'},
      {name:'guests', label:'Guest Count', type:'number', required:true, minValue:1, sample:'45'},
      {name:'budget', label:'Budget ($)', type:'number', required:true, minValue:1, sample:'3200'},
      {name:'activities', label:'Activities / Entertainment', type:'textarea', required:true, min:25, sample:'Dinner, photo backdrop, trivia game, birthday toast, DJ, dancing, and cake presentation.'},
      {name:'timeline', label:'Event Timeline', type:'textarea', required:true, min:35, sample:'5:00 PM setup\n6:30 PM guest arrival\n7:00 PM dinner\n8:00 PM program\n8:30 PM music and dancing\n10:30 PM closing'}
    ]
  },
  {
    id: 'socialpromo', code: 'S3L-LAB-021', title: 'Social Media Promo Practice',
    description: 'Practice gathering the copy and call-to-action needed for a social media business post.',
    fields: [
      {name:'campaign', label:'Campaign / Post Goal', type:'text', required:true, min:4, sample:'Fall Service Spotlight'},
      {name:'platform', label:'Platform', type:'select', required:true, options:['Facebook','Instagram','LinkedIn','Multiple Platforms'], sample:'Facebook'},
      {name:'headline', label:'Attention-Grabbing Headline', type:'text', required:true, min:8, sample:'YOUR IDEA DESERVES MORE THAN A DRAFT.'},
      {name:'message', label:'Main Post Copy', type:'textarea', required:true, min:60, sample:'Turn your next idea into something clear, polished, and ready to share. Choose the service you need, send the project details through the official portal, and let the process stay organized from request to delivery.'},
      {name:'cta', label:'Call to Action', type:'text', required:true, min:8, sample:'Visit the official website to submit your request.'},
      {name:'hashtags', label:'Hashtags', type:'textarea', required:false, sample:'#SmallBusiness #BusinessServices #CustomDesign'}
    ]
  },
  {
    id: 'posterbrief', code: 'S3L-LAB-022', title: 'Poster & Banner Brief Practice',
    description: 'Practice collecting design requirements before building a poster, banner, or large-format graphic.',
    fields: [
      {name:'title', label:'Main Message', type:'text', required:true, min:5, sample:'COMMUNITY FALL FESTIVAL'},
      {name:'size', label:'Finished Size / Format', type:'select', required:true, options:['Social Media Graphic','8.5 × 11 Poster','11 × 17 Poster','Vinyl Banner','Digital Screen','Other'], sample:'11 × 17 Poster'},
      {name:'audience', label:'Target Audience', type:'text', required:true, min:5, sample:'Families and community residents'},
      {name:'details', label:'Required Information', type:'textarea', required:true, min:40, sample:'Event date, start and end time, location, family activities, food vendors, admission information, and contact method.'},
      {name:'style', label:'Style Direction', type:'select', required:true, options:['Elegant','Classic','Modern','Fun & Colorful','Bold'], sample:'Fun & Colorful'},
      {name:'assets', label:'Logos / Photos / Assets Needed', type:'textarea', required:false, sample:'Community logo, sponsor logos, fall-themed photo, QR code.'}
    ]
  },
  {
    id: 'websitebrief', code: 'S3L-LAB-023', title: 'Website Project Brief Practice',
    description: 'Practice asking the questions you need before starting a website project.',
    fields: [
      {name:'business', label:'Business / Project Name', type:'text', required:true, min:3, sample:'Northstar Home Services'},
      {name:'goal', label:'Main Website Goal', type:'textarea', required:true, min:35, sample:'Create a clean website that explains services, builds trust, shows service areas, and gives visitors a simple way to request a quote.'},
      {name:'audience', label:'Target Audience', type:'text', required:true, min:5, sample:'Homeowners in the local service area'},
      {name:'pages', label:'Pages Needed', type:'textarea', required:true, min:20, sample:'Home, About, Services, Gallery, FAQ, Contact / Quote Request'},
      {name:'features', label:'Features Needed', type:'textarea', required:true, min:25, sample:'Mobile navigation, quote form, image gallery, service cards, FAQ accordion, contact information.'},
      {name:'style', label:'Visual Direction', type:'textarea', required:true, min:20, sample:'Clean and modern with warm neutral colors, strong headings, simple icons, and large service photos.'},
      {name:'domain', label:'Domain / Existing Website', type:'url', required:false, sample:'https://example.com'}
    ]
  },
  {
    id: 'brandbrief', code: 'S3L-LAB-024', title: 'Brand & Logo Brief Practice',
    description: 'Practice turning a client’s brand idea into clear design direction before creating visuals.',
    fields: [
      {name:'brand', label:'Brand Name', type:'text', required:true, min:3, sample:'Evergreen Lane Events'},
      {name:'tagline', label:'Tagline', type:'text', required:false, sample:'Moments Made Meaningful'},
      {name:'audience', label:'Ideal Audience', type:'textarea', required:true, min:25, sample:'Adults planning birthdays, anniversaries, intimate dinners, showers, and small community celebrations.'},
      {name:'personality', label:'Brand Personality', type:'textarea', required:true, min:20, sample:'Warm, refined, welcoming, dependable, detail-focused, and memorable.'},
      {name:'colors', label:'Preferred Colors', type:'text', required:true, min:3, sample:'Deep green, champagne, cream'},
      {name:'avoid', label:'What to Avoid', type:'textarea', required:false, sample:'Neon colors, overly playful fonts, crowded layouts.'},
      {name:'uses', label:'Where the Brand Will Be Used', type:'textarea', required:true, min:20, sample:'Website, social media, business cards, event signage, invoices, and printed materials.'}
    ]
  },
  {
    id: 'servicerequest', code: 'S3L-LAB-025', title: 'Service Request Workflow Practice',
    description: 'Practice checking whether a customer request includes enough information to move forward.',
    fields: [
      {name:'requestId', label:'Request ID', type:'text', required:true, min:4, sample:'REQ-1025'},
      {name:'customer', label:'Customer Name', type:'text', required:true, min:3, sample:'Jamie Carter'},
      {name:'service', label:'Service', type:'select', required:true, options:['Document Design','Website','Event Planning','Bookkeeping Support','Office / Clerical','Branding','Other'], sample:'Document Design'},
      {name:'received', label:'Date Received', type:'date', required:true, sample:'2026-09-25'},
      {name:'priority', label:'Priority', type:'select', required:true, options:['Standard','Rush','Same Day'], sample:'Standard'},
      {name:'request', label:'Customer Request', type:'textarea', required:true, min:50, sample:'Create a two-page program using the supplied wording and photos. The customer wants a clean layout, readable sections, and a burgundy-and-ivory color direction.'},
      {name:'missing', label:'Missing Information / Follow-Up', type:'textarea', required:false, sample:'Confirm final photo order and receive the exact event start time.'}
    ]
  },
  {
    id: 'fileorg', code: 'S3L-LAB-026', title: 'File Organization Practice',
    description: 'Practice naming, categorizing, and documenting files so a project stays easy to manage.',
    fields: [
      {name:'project', label:'Project Name', type:'text', required:true, min:3, sample:'Carter Anniversary Program'},
      {name:'filename', label:'File Name', type:'text', required:true, min:6, sample:'carter-anniversary-program-v03.docx'},
      {name:'category', label:'File Category', type:'select', required:true, options:['Customer Upload','Working File','Proof','Final File','Invoice / Receipt','Reference'], sample:'Working File'},
      {name:'version', label:'Version Number', type:'number', required:true, minValue:1, sample:'3'},
      {name:'date', label:'Last Updated', type:'date', required:true, sample:'2026-09-25'},
      {name:'notes', label:'Version Notes', type:'textarea', required:true, min:20, sample:'Updated event time, corrected two names, replaced the cover photo, and adjusted spacing on page two.'}
    ]
  },
  {
    id: 'budget', code: 'S3L-LAB-027', title: 'Project Budget Practice',
    description: 'Practice estimating a project budget and checking whether planned expenses fit within the available amount.',
    fields: [
      {name:'budget', label:'Total Budget ($)', type:'number', required:true, minValue:1, sample:'2500'},
      {name:'venue', label:'Venue ($)', type:'number', required:true, minValue:0, sample:'700'},
      {name:'food', label:'Food / Catering ($)', type:'number', required:true, minValue:0, sample:'850'},
      {name:'decor', label:'Decor ($)', type:'number', required:true, minValue:0, sample:'350'},
      {name:'entertainment', label:'Entertainment ($)', type:'number', required:true, minValue:0, sample:'300'},
      {name:'other', label:'Other Costs ($)', type:'number', required:true, minValue:0, sample:'150'}
    ],
    extraValidation(values) {
      const spent=['venue','food','decor','entertainment','other'].reduce((a,k)=>a+Number(values[k]||0),0);
      return spent>Number(values.budget||0)?'Planned expenses are greater than the total budget.':'';
    },
    calculateLabels: {total:'Planned Expenses', deposit:'Total Budget', balance:'Remaining Budget'},
    calculate(values) {
      const total=['venue','food','decor','entertainment','other'].reduce((a,k)=>a+Number(values[k]||0),0);
      const budget=Number(values.budget||0);
      return {total,deposit:budget,balance:Math.max(0,budget-total)};
    }
  },
  {
    id: 'incomeexpense', code: 'S3L-LAB-028', title: 'Income & Expense Tracker Practice',
    description: 'Practice entering a clean bookkeeping record and calculating the net result for a simple period.',
    fields: [
      {name:'period', label:'Period / Month', type:'text', required:true, min:3, sample:'September 2026'},
      {name:'serviceIncome', label:'Service Income ($)', type:'number', required:true, minValue:0, sample:'1850'},
      {name:'otherIncome', label:'Other Income ($)', type:'number', required:true, minValue:0, sample:'150'},
      {name:'supplies', label:'Supplies ($)', type:'number', required:true, minValue:0, sample:'225'},
      {name:'software', label:'Software ($)', type:'number', required:true, minValue:0, sample:'95'},
      {name:'advertising', label:'Advertising ($)', type:'number', required:true, minValue:0, sample:'120'},
      {name:'otherExpense', label:'Other Expenses ($)', type:'number', required:true, minValue:0, sample:'60'}
    ],
    calculateLabels: {total:'Total Income', deposit:'Total Expenses', balance:'Net'},
    calculate(values) {
      const income=Number(values.serviceIncome||0)+Number(values.otherIncome||0);
      const expenses=Number(values.supplies||0)+Number(values.software||0)+Number(values.advertising||0)+Number(values.otherExpense||0);
      return {total:income,deposit:expenses,balance:income-expenses};
    }
  },
  {
    id: 'accessrecord', code: 'S3L-LAB-029', title: 'Access Database Record Practice',
    description: 'Practice relational-database thinking by creating linked customer and order records with clean IDs.',
    fields: [
      {name:'customerId', label:'Customer ID / Primary Key', type:'text', required:true, min:4, sample:'CUST-1001'},
      {name:'customerName', label:'Customer Name', type:'text', required:true, min:3, sample:'Renee Parker'},
      {name:'email', label:'Email', type:'email', required:true, sample:'renee@example.com'},
      {name:'orderId', label:'Order ID / Primary Key', type:'text', required:true, min:4, sample:'ORD-2045'},
      {name:'customerFk', label:'Order Customer ID / Foreign Key', type:'text', required:true, min:4, sample:'CUST-1001'},
      {name:'service', label:'Service', type:'text', required:true, min:3, sample:'Event Program'},
      {name:'status', label:'Order Status', type:'select', required:true, options:['New','In Progress','Proof Ready','Completed'], sample:'In Progress'}
    ],
    extraValidation(values) { return values.customerId!==values.customerFk?'Foreign key must match the Customer ID for this practice record.':''; }
  },
  {
    id: 'review', code: 'S3L-LAB-030', title: 'Customer Review Form Practice',
    description: 'Practice building and testing a review form with required stars, service information, and useful written feedback.',
    fields: [
      {name:'orderId', label:'Completed Order ID', type:'text', required:true, min:4, sample:'ORD-3001'},
      {name:'customer', label:'Public Display Name', type:'text', required:true, min:2, sample:'Taylor R.'},
      {name:'service', label:'Service Received', type:'text', required:true, min:3, sample:'Website Design'},
      {name:'rating', label:'Star Rating', type:'select', required:true, options:['5 - Excellent','4 - Very Good','3 - Good','2 - Fair','1 - Poor'], sample:'5 - Excellent'},
      {name:'review', label:'Written Review', type:'textarea', required:true, min:40, sample:'The process was easy to follow, the project stayed organized, and the finished website matched the direction we discussed from the beginning.'},
      {name:'permission', label:'Publication Status', type:'select', required:true, options:['Pending Admin Approval','Approved for Website','Rejected / Needs Follow-Up'], sample:'Pending Admin Approval'}
    ]
  }
];

let currentProject = projects[0];

const nav = document.getElementById('projectNav');
const form = document.getElementById('practiceForm');
const results = document.getElementById('results');
const preview = document.getElementById('preview');
const titleEl = document.getElementById('projectTitle');
const codeEl = document.getElementById('projectCode');
const descEl = document.getElementById('projectDescription');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const draftStatus = document.getElementById('draftStatus');

function buildNav() {
  nav.innerHTML = '';
  projects.forEach(project => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'project-button';
    btn.textContent = `${project.code.split('-').pop()} • ${project.title}`;
    btn.dataset.projectId = project.id;
    btn.addEventListener('click', () => selectProject(project.id));
    nav.appendChild(btn);
  });
}

function selectProject(id) {
  currentProject = projects.find(p => p.id === id) || projects[0];
  [...nav.querySelectorAll('.project-button')].forEach(btn => {
    btn.classList.toggle('active', btn.dataset.projectId === currentProject.id);
  });
  titleEl.textContent = currentProject.title;
  codeEl.textContent = currentProject.code;
  descEl.textContent = currentProject.description;
  results.className = 'empty-state';
  results.innerHTML = 'Fill in some fields, then press <strong>Check My Work</strong>.';
  preview.className = 'preview empty-state';
  preview.textContent = 'Your formatted preview will appear here.';
  renderForm();
  loadSavedDraft(false);
  updateProgress();
}

function renderForm() {
  form.innerHTML = '';
  currentProject.fields.forEach(field => {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.dataset.field = field.name;

    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.innerHTML = `${field.label}${field.required ? ' <span class="required">*</span>' : ''}`;
    wrap.appendChild(label);

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
    } else if (field.type === 'select') {
      input = document.createElement('select');
      const blank = document.createElement('option');
      blank.value = '';
      blank.textContent = 'Choose one...';
      input.appendChild(blank);
      field.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
      if (field.type === 'number') input.step = 'any';
    }

    input.id = field.name;
    input.name = field.name;
    input.autocomplete = 'off';
    input.addEventListener('input', () => {
      clearFieldState(wrap);
      updateProgress();
      draftStatus.textContent = 'Unsaved changes';
    });
    input.addEventListener('change', () => {
      clearFieldState(wrap);
      updateProgress();
      draftStatus.textContent = 'Unsaved changes';
    });
    wrap.appendChild(input);

    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = field.required ? 'Required for this practice.' : 'Optional.';
    wrap.appendChild(hint);

    const msg = document.createElement('div');
    msg.className = 'field-message';
    wrap.appendChild(msg);

    form.appendChild(wrap);
  });
}

function getValues() {
  const values = {};
  currentProject.fields.forEach(f => {
    const el = document.getElementById(f.name);
    values[f.name] = el ? el.value.trim() : '';
  });
  return values;
}

function clearFieldState(wrap) {
  wrap.classList.remove('valid', 'invalid');
  const msg = wrap.querySelector('.field-message');
  if (msg) msg.textContent = '';
}

function validateField(field, value) {
  if (field.required && !value) return `${field.label} is required.`;
  if (!value) return '';
  if (field.min && value.length < field.min) return `${field.label} needs at least ${field.min} characters.`;
  if (field.minValue !== undefined && Number(value) < field.minValue) return `${field.label} must be at least ${field.minValue}.`;
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  if (field.type === 'url') {
    try { new URL(value); } catch { return 'Enter a complete website address beginning with http:// or https://'; }
  }
  if (field.pattern === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) return 'Enter a 10-digit phone number.';
  }
  return '';
}

function checkWork() {
  const values = getValues();
  const checks = [];
  let validCount = 0;

  currentProject.fields.forEach(field => {
    const value = values[field.name];
    const error = validateField(field, value);
    const wrap = form.querySelector(`[data-field="${field.name}"]`);
    clearFieldState(wrap);
    if (error) {
      wrap.classList.add('invalid');
      wrap.querySelector('.field-message').textContent = error;
      checks.push({ok:false, text:error});
    } else {
      wrap.classList.add('valid');
      wrap.querySelector('.field-message').textContent = value ? 'Looks good.' : 'Optional field left blank.';
      if (field.required ? !!value : true) validCount++;
      checks.push({ok:true, text:`${field.label}: ${value ? 'passed' : 'optional'}`});
    }
  });

  let extraError = '';
  if (typeof currentProject.extraValidation === 'function') {
    extraError = currentProject.extraValidation(values);
    if (extraError) checks.push({ok:false, text:extraError});
  }

  const requiredFields = currentProject.fields.filter(f => f.required);
  const passedRequired = requiredFields.filter(f => !validateField(f, values[f.name])).length;
  let score = Math.round((passedRequired / requiredFields.length) * 100);
  if (extraError) score = Math.min(score, 90);

  results.className = '';
  results.innerHTML = `
    <div class="score">
      <span>Practice Score</span>
      <strong>${score}%</strong>
    </div>
    <p class="${score === 100 ? 'ok' : 'warn'}"><strong>${score === 100 ? 'Ready for preview!' : 'Keep going—fix the marked fields and test again.'}</strong></p>
    <ul class="checklist">
      ${checks.map(c => `<li class="${c.ok ? 'ok' : 'bad'}">${c.ok ? '✓' : '✗'} ${escapeHtml(c.text)}</li>`).join('')}
    </ul>
  `;

  if (currentProject.calculate) {
    const calc = currentProject.calculate(values);
    const labels = currentProject.calculateLabels || {total:'Calculated Total', deposit:'Deposit', balance:'Balance Due'};
    results.innerHTML += `
      <div class="calc-box">
        <div>${escapeHtml(labels.total)}: <strong>${money(calc.total)}</strong></div>
        <div>${escapeHtml(labels.deposit)}: <strong>${money(calc.deposit)}</strong></div>
        <div>${escapeHtml(labels.balance)}: <strong>${money(calc.balance)}</strong></div>
      </div>`;
  }
  updateProgress();
}

function updateProgress() {
  const values = getValues();
  const required = currentProject.fields.filter(f => f.required);
  const filled = required.filter(f => values[f.name]).length;
  const pct = required.length ? Math.round((filled / required.length) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${pct}% filled`;
}

function loadSample() {
  currentProject.fields.forEach(field => {
    const el = document.getElementById(field.name);
    if (el) el.value = field.sample || '';
  });
  draftStatus.textContent = 'Sample loaded';
  results.className = 'empty-state';
  results.innerHTML = 'Sample data loaded. Press <strong>Check My Work</strong> to test it.';
  updateProgress();
}

function resetForm() {
  if (!confirm('Clear all fields for this practice project?')) return;
  form.reset();
  form.querySelectorAll('.field').forEach(clearFieldState);
  results.className = 'empty-state';
  results.innerHTML = 'Form cleared. Start again, then press <strong>Check My Work</strong>.';
  preview.className = 'preview empty-state';
  preview.textContent = 'Your formatted preview will appear here.';
  draftStatus.textContent = 'Draft not saved';
  updateProgress();
}

function saveDraft() {
  localStorage.setItem(`s3lfmade-lab-${currentProject.id}`, JSON.stringify(getValues()));
  draftStatus.textContent = 'Draft saved on this device';
}

function loadSavedDraft(showMessage = true) {
  const raw = localStorage.getItem(`s3lfmade-lab-${currentProject.id}`);
  if (!raw) {
    draftStatus.textContent = 'Draft not saved';
    return;
  }
  try {
    const values = JSON.parse(raw);
    currentProject.fields.forEach(field => {
      const el = document.getElementById(field.name);
      if (el && values[field.name] !== undefined) el.value = values[field.name];
    });
    draftStatus.textContent = 'Saved draft restored';
    if (showMessage) alert('Saved draft loaded.');
  } catch {
    draftStatus.textContent = 'Could not restore draft';
  }
}

function renderPreview() {
  const values = getValues();
  const hasAnything = Object.values(values).some(Boolean);
  if (!hasAnything) {
    preview.className = 'preview empty-state';
    preview.textContent = 'Enter some information first, then press Preview.';
    return;
  }

  const items = currentProject.fields
    .filter(f => values[f.name])
    .map(f => `<div class="preview-chip"><strong>${escapeHtml(f.label)}</strong><br>${formatValue(values[f.name])}</div>`)
    .join('');

  let calcHtml = '';
  if (currentProject.calculate) {
    const calc = currentProject.calculate(values);
    const labels = currentProject.calculateLabels || {total:'Total', deposit:'Deposit', balance:'Balance'};
    calcHtml = `<div class="calc-box"><strong>${escapeHtml(labels.total)}:</strong> ${money(calc.total)} &nbsp; | &nbsp; <strong>${escapeHtml(labels.deposit)}:</strong> ${money(calc.deposit)} &nbsp; | &nbsp; <strong>${escapeHtml(labels.balance)}:</strong> ${money(calc.balance)}</div>`;
  }

  preview.className = 'preview';
  preview.innerHTML = `
    <div class="preview-card">
      <p class="eyebrow">${escapeHtml(currentProject.code)}</p>
      <h2>${escapeHtml(currentProject.title.replace('Practice','Preview'))}</h2>
      <div class="preview-grid">${items}</div>
      ${calcHtml}
    </div>`;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
function formatValue(str) { return escapeHtml(str).replace(/\n/g, '<br>'); }
function money(n) { return Number(n || 0).toLocaleString('en-US', {style:'currency', currency:'USD'}); }

document.getElementById('loadSampleBtn').addEventListener('click', loadSample);
document.getElementById('checkBtn').addEventListener('click', checkWork);
document.getElementById('previewBtn').addEventListener('click', renderPreview);
document.getElementById('saveBtn').addEventListener('click', saveDraft);
document.getElementById('resetBtn').addEventListener('click', resetForm);

buildNav();
selectProject(projects[0].id);
