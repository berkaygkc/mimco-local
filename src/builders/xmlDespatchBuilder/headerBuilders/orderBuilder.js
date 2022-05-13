
module.exports =  orderBuilder = async (data) => {
    if(data.Order) {
        if(data.Order.Date && data.Order.Value) {
            const object = {
                'cac:OrderReference':{
                    'cbc:ID': data.Order.Value,
                    'cbc:IssueDate': data.Order.Date.split('T')[0]
                }
            }
            return object;
        } else return ''
    }
    else return ''
}