from app.py import db


class Measurement(db.Model):
    __tablename__ = 'measurement'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    date = db.Column(db.String(64))
    prcp = db.Column(db.Float)
    tobs= db.Column(db.Float)


    def __repr__(self):
        return '<Measurement %r>' % (self.name)

class Station(db.Model):
    __tablename__ = 'station'

    id = db.Column(db.Integer, primary_key=True)
    station = db.Column(db.String(64))
    name = db.Column(db.String(64))
    latitude = db.Column(db.Float)
    longitude= db.Column(db.Float)
    elevation = db.Column(db.Float)


    def __repr__(self):
        return '<Station %r>' % (self.name)
