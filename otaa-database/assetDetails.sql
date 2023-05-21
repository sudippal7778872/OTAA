create table assetdetails (
	AssetPID int Primary Key auto_increment,
	VendorId varchar(256),
	DeviceType varchar(256),
	ProductName varchar(256),
	Version varchar(100),
	SerialNumber varchar(50),
	Ip varchar(50),
	Mac varchar(80),
	CreatedAt datetime default CURRENT_TIMESTAMP(),
	CreatedBy int,
	UpdatedAt datetime,
	UpdatedBy int
)