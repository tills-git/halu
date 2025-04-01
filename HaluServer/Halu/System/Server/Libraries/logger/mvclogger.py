# coding: utf-8

from logger.halulogger         import HaluLogger


class MvcLogger:

    hlog  = HaluLogger('halu')
    alog  = HaluLogger('appserver')
    clog  = HaluLogger('controller')
    mlog  = HaluLogger('model')
    vlog  = HaluLogger('view')
    dlog  = HaluLogger('database')
    dclog = HaluLogger('databasecommon')
