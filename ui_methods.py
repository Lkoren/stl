import locale 
locale.setlocale(locale.LC_ALL, '') 

def currency(self, num):
	return locale.currency(num, grouping=True)