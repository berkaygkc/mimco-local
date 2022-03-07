
module.exports =  orderBuilder = async (data) => {
    if(data.Order && data.order.Date && data.Order.Value) {
        const object = {
            'cac:OrderReference':{
                'cbc:ID': data.Order.Value,
                'cbc:IssueDate': data.order.Date
            }
        }
        return object;
    }
    else return ''
}