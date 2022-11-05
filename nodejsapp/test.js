var base_url_service = "https://qa-$$$.#ENV#.infaqa.com/#SERVICE#/mgmtapi/version/";
const env = ['REL', 'ML', 'MREL', 'PATCH', 'EBF', 'UPGRADE', 'FEDRAMP', 'FEDRAMP MREL']

var AWS_env_dict = { 'REL': 'rel', 'ML': 'ml', 'MREL': 'mrel', 'PATCH': 'patch', 'EBF': 'ebf', 'UPGRADE': 'upgrade', 'EA': 'ea' }
var GCP_env_dict = { 'REL': 'crel2', 'MREL': 'mrel2', 'PATCH': 'rel2', 'UPGRADE': 'upgrade2' }
var AZURE_env_dict = { 'REL': 'rel1', 'MREL': 'mrel1', 'PATCH': 'rel-azure', 'UPGRADE': 'upgrade1' }
var pod2 = ['REL', 'MREL', 'PATCH', 'UPGRADE']


const aws_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'orgexpiry'];
const aws_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime']
const azure_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'orgexpiry'];
const azure_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime', 'ntt-service', 'azure-service']
const gcp_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'orgexpiry', 'gcpmarketplace'];
const gcp_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime', 'gcp-service']






//if key == fedramp change infaqa to informaticagovcloud
//,'FEDRAMP':'','FEDRAMP MREL':''


// for (let i = 0; i < env.length; i++) {
//     if(AWS_env_dict[env[i]] != undefined)
//     console.log("\n\n \t\t" + env[i])
//     {
//         for (let j = 0; j < aws_global_service_list.length; j++) {
//             let global_url = base.replace('$$$','ma');
//             global_url = global_url.replace('#ENV#',AWS_env_dict[env[i]]);
//             global_url = global_url.replace("#SERVICE#",aws_global_service_list[j])

//             // console.log(global_url);
//         }
//         for (let j = 0; j < aws_global_service_list.length; j++) {
//             let pod1_url = base.replace('$$$','pod1');
//             pod1_url = pod1_url.replace('#ENV#',AWS_env_dict[env[i]]);
//             pod1_url = pod1_url.replace("#SERVICE#",aws_pod_service_list[j])
//             let pod2_url = '';
//             if(pod2.indexOf(env[i]) != -1)
//                 pod2_url = pod1_url.replace('pod1','pod2')

//             console.log("POD1: -- >" + pod1_url)
//             console.log("POD2: -- >" + pod2_url)
//         }
//     }

// }

var base_url_env = "https://qa-$$$.#ENV#.infaqa.com"

for (let i = 0; i < env.length; i++) {

    if(AWS_env_dict[env[i]] != undefined){
        console.log("AWS" + env[i]+"\t\t\t\n\n")
        let global_url = base_url_env.replace('$$$','ma') 
        global_url = global_url.replace('#ENV#',AWS_env_dict[env[i]]);
        console.log("GLOBAL : " + global_url);
        let common_url = base_url_env.replace('$$$','common') 
        common_url = common_url.replace('#ENV#',AWS_env_dict[env[i]]);
        console.log("COMMON : " +common_url);
        let pod1_url = base_url_env.replace('$$$','pod1') 
        pod1_url = pod1_url.replace('#ENV#',AWS_env_dict[env[i]]);
        console.log("POD1 : " + pod1_url);
        let pod2_url = '';
        if(pod2.indexOf(env[i]) != -1){
            pod2_url = pod1_url.replace('pod1','pod2')
            console.log("POD2 : " +pod2_url)
        }
    }
    if(AZURE_env_dict[env[i]] != undefined){
        console.log("AZURE    " + env[i]+"\t\t\t\n\n")
        let global_url = base_url_env.replace('$$$','ma') 
        global_url = global_url.replace('#ENV#',AZURE_env_dict[env[i]]);
        console.log("GLOBAL : " +global_url);
        let common_url = base_url_env.replace('$$$','common') 
        common_url = common_url.replace('#ENV#',AZURE_env_dict[env[i]]);
        console.log("COMMON : " +common_url);
        let pod1_url = base_url_env.replace('$$$','pod1') 
        pod1_url = pod1_url.replace('#ENV#',AZURE_env_dict[env[i]]);
        console.log("POD1 : " +pod1_url);
        
    }
    if(GCP_env_dict[env[i]] != undefined){
        console.log("GCP    "+env[i]+"\t\t\t\n\n")
        let global_url = base_url_env.replace('$$$','ma') 
        global_url = global_url.replace('#ENV#',GCP_env_dict[env[i]]);
        console.log("GLOBAL : " +global_url);
        let common_url = base_url_env.replace('$$$','common') 
        common_url = common_url.replace('#ENV#',GCP_env_dict[env[i]]);
        console.log("COMMON : " +common_url);
        let pod1_url = base_url_env.replace('$$$','pod1') 
        pod1_url = pod1_url.replace('#ENV#',GCP_env_dict[env[i]]);
        console.log("POD1 : " +pod1_url);
        
    }
}