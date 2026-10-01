-- ACCESS PRACTICE QUERIES
-- Paste/adapt these into Access Query Design -> SQL View.

-- 1) Open orders
SELECT Orders.OrderID, Customers.FirstName, Customers.LastName, Services.ServiceName,
       Orders.DueDate, Orders.QuotedAmount
FROM (Customers INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID)
INNER JOIN Services ON Orders.ServiceID = Services.ServiceID
WHERE Orders.Status = 'Open';

-- 2) Orders with calculated payments and balance
SELECT Orders.OrderID,
       Orders.QuotedAmount,
       Nz(Sum(Payments.Amount),0) AS AmountPaid,
       Orders.QuotedAmount - Nz(Sum(Payments.Amount),0) AS Balance
FROM Orders LEFT JOIN Payments ON Orders.OrderID = Payments.OrderID
GROUP BY Orders.OrderID, Orders.QuotedAmount;

-- 3) Revenue by service
SELECT Services.ServiceName, Sum(Payments.Amount) AS RevenueReceived
FROM (Services INNER JOIN Orders ON Services.ServiceID = Orders.ServiceID)
INNER JOIN Payments ON Orders.OrderID = Payments.OrderID
GROUP BY Services.ServiceName
ORDER BY Sum(Payments.Amount) DESC;

-- 4) Customers with more than one order
SELECT Customers.CustomerID, Customers.FirstName, Customers.LastName, Count(Orders.OrderID) AS OrderCount
FROM Customers INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID
GROUP BY Customers.CustomerID, Customers.FirstName, Customers.LastName
HAVING Count(Orders.OrderID) > 1;

-- 5) Parameter query by last name
PARAMETERS [Enter customer last name:] Text ( 255 );
SELECT Customers.*, Orders.OrderID, Orders.Status, Orders.QuotedAmount
FROM Customers LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID
WHERE Customers.LastName = [Enter customer last name:];

-- 6) Orders due within 14 days of today
SELECT OrderID, DueDate, Status, QuotedAmount
FROM Orders
WHERE DueDate Between Date() And Date()+14
ORDER BY DueDate;
