const currentVersion = "v1.2.0";

async function fetchLatestVersionUrl(newVersionTips) {
	// 定义GitHub仓库的API URL
	const repoUrl =
		"https://api.github.com/repos/CrazySpottedDove/Lab-Assistance/releases/latest";

	try {
        console.log(newVersionTips)
        if(!newVersionTips){
            return null
        }
		// 使用fetch API获取仓库的最新发布版本信息
		const response = await fetch(repoUrl);

		// 将响应转换为JSON格式
		const data = await response.json();

		// 处理JSON数据，提取最新版本号并传递给compareVersions函数
		console.log(data.tag_name);
		if (hasNewVersion(data.tag_name)) {
			return data.html_url; // 返回下载链接
		} else {
			return null; // 返回null
		}
	} catch (error) {
		return null; // 返回null以表示失败
	}
}


/**
 * 检查是否有新版本
 * @param {string} latestVersion - 最新版本号（可能包含前置 'v'）
 * @returns {boolean} - 如果当前版本小于最新版本，则返回true，否则返回false
 */
function hasNewVersion(latestVersion) {
    // 去除版本号中的前置 'v'
    const cleanCurrentVersion = currentVersion.replace(/^v/, '');
    const cleanLatestVersion = latestVersion.replace(/^v/, '');

    // 将当前版本号和最新版本号分割成数组，并将字符串转换为数字
    const currentParts = cleanCurrentVersion.split(".").map(Number);
    const latestParts = cleanLatestVersion.split(".").map(Number);

    // 遍历当前版本和最新版本的所有部分，进行比较
    for (
        let i = 0;
        i < Math.max(currentParts.length, latestParts.length);
        i++
    ) {
        // 如果当前部分不存在，则默认为0
        const currentPart = currentParts[i] || 0;
        // 如果最新部分不存在，则默认为0
        const latestPart = latestParts[i] || 0;

        // 如果当前部分小于最新部分，显示更新提示并停止比较
        if (currentPart < latestPart) {
            return true;
        } else if (currentPart > latestPart) {
            // 如果当前部分大于最新部分，则停止比较
            return false;
        }
    }

    // 如果所有部分都相等，则认为版本相同
    return false;
}


export { fetchLatestVersionUrl};

