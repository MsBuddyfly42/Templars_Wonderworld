MICROSOFT ACCESS PRACTICE DATABASE KIT

Why this folder uses CSV + SQL instead of an .accdb file:
This environment cannot reliably generate Microsoft's proprietary Access .accdb binary format.
These files are intentionally Access-ready: import the four CSV files into a new blank Access database,
then use the included SQL and exercises to build a fully functioning database yourself.

QUICK START IN ACCESS
1. Open Microsoft Access.
2. Choose Blank database and name it Access_Practice_Playground.accdb.
3. Go to External Data > New Data Source > From File > Text File.
4. Import Customers.csv as a new table. Check "First Row Contains Field Names".
5. Repeat for Services.csv, Orders.csv, and Payments.csv.
6. In Design View, set these primary keys:
   Customers.CustomerID
   Services.ServiceID
   Orders.OrderID
   Payments.PaymentID
7. Open Database Tools > Relationships.
8. Create these one-to-many relationships and enforce referential integrity:
   Customers.CustomerID -> Orders.CustomerID
   Services.ServiceID -> Orders.ServiceID
   Orders.OrderID -> Payments.OrderID
9. Build queries using Queries.sql.
10. Build a Customer Form, an Order Entry Form, and a Revenue by Service Report.

EXTRA CHALLENGES
- Add an Employees table.
- Add a Tasks table linked to Orders.
- Make a query for unpaid balances over $200.
- Make a dashboard form with buttons to open forms/reports.
- Add validation rules to Status and PaymentType.
- Create a monthly revenue crosstab query.
